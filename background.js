// Capture a page thumbnail without Chrome's debugger banner.
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function waitForTab(tabId, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = err => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      err ? reject(err) : resolve();
    };
    const timeout = setTimeout(() => finish(new Error('The page did not finish loading within 30 seconds.')), timeoutMs);
    const onUpdated = (id, info) => { if (id === tabId && info.status === 'complete') finish(); };
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId, tab => {
      if (chrome.runtime.lastError) finish(new Error(chrome.runtime.lastError.message));
      else if (tab?.status === 'complete') finish();
    });
  });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'PSD_GRAB_THUMBNAIL') return false;
  (async () => {
    let targetTabId = null;
    let originalTabId = null;
    let originalWindowId = null;
    const startedAt = Date.now();
    let stage = 'preparing capture';
    try {
      const [active] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      if (active?.id != null) originalTabId = active.id;
      if (active?.windowId != null) originalWindowId = active.windowId;
      stage = 'opening page in a temporary tab';
      const tab = await chrome.tabs.create({url: message.url, active: true, ...(originalWindowId != null ? {windowId: originalWindowId} : {})});
      targetTabId = tab.id;
      stage = 'waiting for page load';
      await waitForTab(targetTabId);
      // Wait at least four seconds from opening the temporary tab, after load.
      await sleep(Math.max(0, 4000 - (Date.now() - startedAt)));
      stage = 'capturing visible tab';
      const dataUrl = await chrome.tabs.captureVisibleTab(originalWindowId ?? tab.windowId, {format: 'png'});
      const data = dataUrl.split(',')[1];
      if (!data) throw new Error('Chrome returned an empty screenshot.');
      sendResponse({ok:true, data});
    } catch (error) {
      sendResponse({ok:false, error:`${stage}: ${error?.message || String(error)}`});
    } finally {
      // Close the temporary site tab and return to the original dials tab.
      if (targetTabId != null) { try { await chrome.tabs.remove(targetTabId); } catch {} }
      if (originalTabId != null) {
        try { await chrome.tabs.update(originalTabId, {active:true}); } catch {}
      }
      if (originalWindowId != null) {
        try { await chrome.windows.update(originalWindowId, {focused:true}); } catch {}
      }
    }
  })();
  return true;
});

