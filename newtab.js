document.addEventListener('DOMContentLoaded', () => {
  // Reset preferences to bundled defaults.
  const resetAllSettingsButton = document.getElementById('reset-all-settings-btn');
  resetAllSettingsButton?.addEventListener('click', async () => {
    const translateResetText = (key) => window.PrivateSpeedDialI18n?.t?.(key) || key;
    if (!window.confirm(translateResetText("Reset all settings to the defaults? This will replace your current settings and shortcuts. Your settings will be reset."))) return;

    resetAllSettingsButton.disabled = true;
    resetAllSettingsButton.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(chrome.runtime.getURL('defaults.json'), { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load defaults.json');
      const defaults = await response.json();
      if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
        throw new Error('The defaults file is invalid');
      }

      const existing = await new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
          const error = chrome.runtime.lastError;
          if (error) reject(new Error(error.message));
          else resolve(items || {});
        });
      });
      // Remove settings, cached weather data and custom image keys absent from defaults.json.
      const obsoleteKeys = Object.keys(existing).filter((key) =>
        !Object.prototype.hasOwnProperty.call(defaults, key)
      );
      if (obsoleteKeys.length) {
        await new Promise((resolve, reject) => {
          chrome.storage.local.remove(obsoleteKeys, () => {
            const error = chrome.runtime.lastError;
            if (error) reject(new Error(error.message));
            else resolve();
          });
        });
      }
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ ...defaults, __speedDialDefaultsApplied: true }, () => {
          const error = chrome.runtime.lastError;
          if (error) reject(new Error(error.message));
          else resolve();
        });
      });

      // Clear startup visual hints so they cannot override default appearance before reload.
      try {
        [
          'psd-dark-theme-hint',
          'psd-bg-mode-hint',
          'psd-bg-color-hint',
          'psd-custom-bg-image-hint'
        ].forEach((key) => localStorage.removeItem(key));
      } catch (_) {}

      window.location.reload();
    } catch (error) {
      console.error('Could not reset settings:', error);
      window.alert(translateResetText('Could not reset settings. Please try again.'));
      resetAllSettingsButton.disabled = false;
      resetAllSettingsButton.removeAttribute('aria-busy');
    }
  });
  // Chrome Sync tem limites de escrita por minuto. Agrupa alterações rápidas
  // dos controlos e trata os erros através do callback para evitar rejeições
  // não tratadas quando o limite é atingido.
  let preferenceSaveTimer = null;
  let colorSaveTimer = null;
  function safeSyncSet(values, callback) {
    chrome.storage.local.set(values, () => {
      const error = chrome.runtime.lastError;
      if (error) console.warn('Não foi possível guardar definições locais:', error.message);
      if (typeof callback === 'function') callback(error || null);
    });
  }
  // Search bar preferences are stored independently and applied on every new tab.
  const searchbar = document.getElementById('page-searchbar');
  const searchbarInput = document.getElementById('page-search-input');
  const searchbarIds = ['searchbar-enabled','searchbar-width','searchbar-height','searchbar-shape','searchbar-opacity','searchbar-color','searchbar-limit-color','searchbar-glow-color','searchbar-glow-size','searchbar-glow-opacity','searchbar-vertical','searchbar-horizontal','searchbar-font-family','searchbar-font-size','searchbar-font-weight','searchbar-font-color'];
  const searchbarDefaults = {searchbarEnabled:false,searchbarWidth:560,searchbarHeight:44,searchbarShape:100,searchbarOpacity:100,searchbarColor:'#ffffff',searchbarLimitColor:'#d2d2d7',searchbarGlowColor:'#9b5de5',searchbarGlowSize:12,searchbarGlowOpacity:20,searchbarVertical:0,searchbarHorizontal:0,searchbarFontFamily:'system',searchbarFontSize:16,searchbarFontWeight:'400',searchbarFontColor:'#1d1d1f'};
  const searchbarMap = {'searchbar-enabled':'searchbarEnabled','searchbar-width':'searchbarWidth','searchbar-height':'searchbarHeight','searchbar-shape':'searchbarShape','searchbar-opacity':'searchbarOpacity','searchbar-color':'searchbarColor','searchbar-limit-color':'searchbarLimitColor','searchbar-glow-color':'searchbarGlowColor','searchbar-glow-size':'searchbarGlowSize','searchbar-glow-opacity':'searchbarGlowOpacity','searchbar-vertical':'searchbarVertical','searchbar-horizontal':'searchbarHorizontal','searchbar-font-family':'searchbarFontFamily','searchbar-font-size':'searchbarFontSize','searchbar-font-weight':'searchbarFontWeight','searchbar-font-color':'searchbarFontColor'};
  function luminance(hex) {
    const raw = String(hex || '#ffffff').replace('#','');
    if (!/^[0-9a-f]{6}$/i.test(raw)) return 1;
    const rgb = [0,2,4].map(i => parseInt(raw.slice(i,i+2),16)/255).map(v => v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
    return 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2];
  }
  function contrastingText(hex) { return luminance(hex) > 0.42 ? '#1d1d1f' : '#f5f5f7'; }
  function applySearchbar(prefs = {}) {
    if (!searchbar) return;
    const get = (key) => prefs[key] ?? searchbarDefaults[key];
    const enabled = Boolean(get('searchbarEnabled'));
    searchbar.classList.toggle('hidden', !enabled);
    const root = document.documentElement;
    root.style.setProperty('--searchbar-width', `${Math.max(240,Math.min(1200,Number(get('searchbarWidth'))||560))}px`);
    root.style.setProperty('--searchbar-height', `${Math.max(28,Math.min(100,Number(get('searchbarHeight'))||44))}px`);
    root.style.setProperty('--searchbar-radius', `${Math.max(0,Math.min(100,Number(get('searchbarShape')) ?? 100)) * 0.36}px`);
    const dark = document.body.classList.contains('dark-theme');
    const barColor = get('searchbarColor');
    const textColor = get('searchbarFontColor') || contrastingText(barColor);
    const bgHex = String(barColor || '#ffffff').replace('#','');
    const bgRgb = /^[0-9a-f]{6}$/i.test(bgHex) ? [0,2,4].map(i => parseInt(bgHex.slice(i,i+2),16)) : [255,255,255];
    const bgOpacity = Math.max(0,Math.min(100,Number(get('searchbarOpacity')) ?? 100)) / 100;
    root.style.setProperty('--searchbar-bg', `rgba(${bgRgb[0]}, ${bgRgb[1]}, ${bgRgb[2]}, ${bgOpacity})`);
    root.style.setProperty('--searchbar-limit', get('searchbarLimitColor'));
    root.style.setProperty('--searchbar-glow', get('searchbarGlowColor'));
    root.style.setProperty('--searchbar-glow-size', `${Math.max(0,Math.min(60,Number(get('searchbarGlowSize'))||0))}px`);
    root.style.setProperty('--searchbar-glow-opacity', `${Math.max(0,Math.min(100,Number(get('searchbarGlowOpacity'))||0))}%`);
    root.style.setProperty('--searchbar-y', `${Number(get('searchbarVertical'))||0}px`);
    root.style.setProperty('--searchbar-x', `${Number(get('searchbarHorizontal'))||0}px`);
    root.style.setProperty('--searchbar-font-family', get('searchbarFontFamily') === 'system' ? 'system-ui' : get('searchbarFontFamily'));
    root.style.setProperty('--searchbar-font-size', `${Math.max(10,Math.min(32,Number(get('searchbarFontSize'))||16))}px`);
    root.style.setProperty('--searchbar-font-weight', String(get('searchbarFontWeight')));
    root.style.setProperty('--searchbar-text', textColor);
    searchbarIds.forEach(id => { const el=document.getElementById(id), key=searchbarMap[id]; if(el) el.value=String(get(key)); if(el && el.type==='checkbox') el.checked=Boolean(get(key)); });
    const colorPicker = document.getElementById('searchbar-color');
    if (colorPicker) { colorPicker.value = barColor; window.syncColorPickerSwatches?.(); }
    const textPicker = document.getElementById('searchbar-font-color');
    if (textPicker) textPicker.value = textColor;
    const widthOutput=document.getElementById('searchbar-width-value'); if(widthOutput) widthOutput.textContent=`${get('searchbarWidth')} px`;
    const heightOutput=document.getElementById('searchbar-height-value'); if(heightOutput) heightOutput.textContent=`${get('searchbarHeight')} px`;
    const shapeOutput=document.getElementById('searchbar-shape-value'); if(shapeOutput) shapeOutput.textContent=`${get('searchbarShape')}%`;
    const searchbarOpacityOutput=document.getElementById('searchbar-opacity-value'); if(searchbarOpacityOutput) searchbarOpacityOutput.textContent=`${get('searchbarOpacity')}%`;
    const sizeOutput=document.getElementById('searchbar-glow-size-value'); if(sizeOutput) sizeOutput.textContent=`${get('searchbarGlowSize')} px`;
    const opacityOutput=document.getElementById('searchbar-glow-opacity-value'); if(opacityOutput) opacityOutput.textContent=`${get('searchbarGlowOpacity')}%`;
    const yOutput=document.getElementById('searchbar-vertical-value'); if(yOutput) yOutput.textContent=`${get('searchbarVertical')} px`;
    const xOutput=document.getElementById('searchbar-horizontal-value'); if(xOutput) xOutput.textContent=`${get('searchbarHorizontal')} px`;
  }
  chrome.storage.local.get(Object.keys(searchbarDefaults), applySearchbar);
  searchbarIds.forEach(id => { const el=document.getElementById(id); if(!el) return; el.addEventListener('input', () => { const key=searchbarMap[id]; const value=el.type==='checkbox' ? el.checked : (el.type==='range'||el.type==='number' ? Number(el.value) : el.value); if (key === 'searchbarColor') { const autoText = contrastingText(value); const textPicker = document.getElementById('searchbar-font-color'); if (textPicker) textPicker.value = autoText; safeSyncSet({[key]:value, searchbarFontColor:autoText}); } else { if(key==='searchbarFontColor'){document.documentElement.style.setProperty('--searchbar-text',value);applyWeatherTextColor(value);} safeSyncSet({[key]:value}); } chrome.storage.local.get(Object.keys(searchbarDefaults), applySearchbar); }); el.addEventListener('change', () => { const key=searchbarMap[id]; const value=el.type==='checkbox' ? el.checked : (el.type==='range'||el.type==='number' ? Number(el.value) : el.value); if (key === 'searchbarColor') { const autoText = contrastingText(value); const textPicker = document.getElementById('searchbar-font-color'); if (textPicker) textPicker.value = autoText; safeSyncSet({[key]:value, searchbarFontColor:autoText}); } else { if(key==='searchbarFontColor'){document.documentElement.style.setProperty('--searchbar-text',value);applyWeatherTextColor(value);} safeSyncSet({[key]:value}); } chrome.storage.local.get(Object.keys(searchbarDefaults), applySearchbar); }); });
  searchbar?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchbarInput?.value.trim();
    if (!query) return;
    // Submit through Chrome's Search API so Chrome's existing default provider is respected.
    try {
      if (!chrome.search?.query) throw new Error('Chrome Search API is unavailable.');
      await chrome.search.query({ text: query, disposition: 'CURRENT_TAB' });
    } catch (error) {
      // Do not fall back to a hard-coded search URL, which would override the user's provider.
      console.error('Could not submit search through Chrome’s default provider:', error);
    }
  });
  // Weather indicator with cached current conditions and 7-day forecast.
  const weatherWidget=document.getElementById('searchbar-weather'), weatherCityLabel=weatherWidget?.querySelector('.weather-city'), weatherIcon=weatherWidget?.querySelector('.weather-icon'), weatherTemp=weatherWidget?.querySelector('.weather-temp'), weatherTooltip=weatherWidget?.querySelector('.weather-tooltip'), weatherCitySetting=document.getElementById('weather-city-setting'), weatherIntervalSetting=document.getElementById('weather-interval-setting'),weatherUnitSetting=document.getElementById('weather-unit-setting');
  const weatherDefaults={weatherCity:'London, England, United Kingdom',weatherIntervalMinutes:30,weatherUnit:'metric'}; let weatherRequestInProgress=false,weatherRefreshPending=false,weatherSuggestTimer=0,weatherSuggestController=null; const weatherCitySuggestions=document.getElementById('weather-city-suggestions');
  // Keep the forecast in the browser's top layer while it opens, is displayed, and closes.
  let weatherTooltipCloseTimer = null;
  let weatherTooltipOpenTimer = null;
  const WEATHER_TOOLTIP_OPEN_DELAY = 300;
  const WEATHER_TOOLTIP_CLOSE_DELAY = 280;
  const WEATHER_TOOLTIP_ANIMATION_MS = 250;
  function weatherTooltipIsOpen() {
    return Boolean(weatherTooltip && weatherTooltip.matches(':popover-open'));
  }
  function weatherTooltipHasPointerOrFocus() {
    return Boolean(
      weatherWidget?.matches(':hover') || weatherTooltip?.matches(':hover') ||
      weatherWidget?.contains(document.activeElement) || weatherTooltip?.contains(document.activeElement)
    );
  }
  function positionWeatherTooltip() {
    if (!weatherTooltip || !weatherTooltipIsOpen() || !weatherWidget) return;
    const anchor = weatherWidget.getBoundingClientRect();
    const width = Math.max(0, Math.min(324, window.innerWidth - 24));
    weatherTooltip.style.width = `${width}px`;
    const tip = weatherTooltip.getBoundingClientRect();
    const actualWidth = tip.width || width;
    const horizontalPadding = 12;
    const left = Math.max(horizontalPadding, Math.min(anchor.right - actualWidth, window.innerWidth - actualWidth - horizontalPadding));
    const verticalPadding = 12;
    const gap = 8;
    let top = anchor.bottom + gap;
    if (top + tip.height > window.innerHeight - verticalPadding) {
      top = anchor.top - tip.height - gap;
    }
    top = Math.max(verticalPadding, Math.min(top, Math.max(verticalPadding, window.innerHeight - tip.height - verticalPadding)));
    weatherTooltip.style.left = `${left}px`;
    weatherTooltip.style.top = `${top}px`;
  }
  function showWeatherTooltip() {
    if (!weatherTooltip || typeof weatherTooltip.showPopover !== 'function') return;
    clearTimeout(weatherTooltipOpenTimer);
    weatherTooltipOpenTimer = null;
    clearTimeout(weatherTooltipCloseTimer);
    weatherTooltipCloseTimer = null;
    try {
      if (!weatherTooltipIsOpen()) weatherTooltip.showPopover();
    } catch (_) { return; }
    weatherTooltip.classList.remove('is-closing');
    positionWeatherTooltip();
    requestAnimationFrame(() => {
      if (weatherTooltipIsOpen() && !weatherTooltip.classList.contains('is-closing')) {
        weatherTooltip.classList.add('is-visible');
        positionWeatherTooltip();
      }
    });
  }
  function scheduleWeatherTooltipOpen() {
    if (!weatherWidget || !weatherTooltip) return;
    clearTimeout(weatherTooltipOpenTimer);
    if (weatherTooltipIsOpen()) {
      // Once open, entering the weather info again should cancel its pending close immediately.
      showWeatherTooltip();
      return;
    }
    weatherTooltipOpenTimer = setTimeout(() => {
      weatherTooltipOpenTimer = null;
      if (weatherWidget.matches(':hover')) showWeatherTooltip();
    }, WEATHER_TOOLTIP_OPEN_DELAY);
  }
  function handleWeatherWidgetPointerLeave() {
    clearTimeout(weatherTooltipOpenTimer);
    weatherTooltipOpenTimer = null;
    scheduleWeatherTooltipClose();
  }
  function scheduleWeatherTooltipClose() {
    if (!weatherTooltip || !weatherTooltipIsOpen()) return;
    clearTimeout(weatherTooltipCloseTimer);
    weatherTooltipCloseTimer = setTimeout(() => {
      if (weatherTooltipHasPointerOrFocus()) {
        weatherTooltipCloseTimer = null;
        return;
      }
      weatherTooltip.classList.remove('is-visible');
      weatherTooltip.classList.add('is-closing');
      // Do not remove the popover from the top layer until the opacity/transform exit finishes.
      weatherTooltipCloseTimer = setTimeout(() => {
        if (weatherTooltipHasPointerOrFocus()) {
          weatherTooltipCloseTimer = null;
          showWeatherTooltip();
          return;
        }
        try { if (weatherTooltipIsOpen()) weatherTooltip.hidePopover(); } catch (_) {}
        weatherTooltip.classList.remove('is-visible', 'is-closing');
        weatherTooltip.style.removeProperty('left');
        weatherTooltip.style.removeProperty('top');
        weatherTooltip.style.removeProperty('width');
        weatherTooltipCloseTimer = null;
      }, WEATHER_TOOLTIP_ANIMATION_MS);
    }, WEATHER_TOOLTIP_CLOSE_DELAY);
  }
  // Delay opening only for hover over the weather indicator; keyboard focus remains immediate.
  weatherWidget?.addEventListener('pointerenter', scheduleWeatherTooltipOpen);
  weatherWidget?.addEventListener('pointerleave', handleWeatherWidgetPointerLeave);
  weatherTooltip?.addEventListener('pointerenter', showWeatherTooltip);
  weatherTooltip?.addEventListener('pointerleave', scheduleWeatherTooltipClose);
  weatherWidget?.addEventListener('focusin', showWeatherTooltip);
  weatherWidget?.addEventListener('focusout', scheduleWeatherTooltipClose);
  weatherTooltip?.addEventListener('focusin', showWeatherTooltip);
  weatherTooltip?.addEventListener('focusout', scheduleWeatherTooltipClose);
  window.addEventListener('resize', positionWeatherTooltip, { passive: true });
  window.addEventListener('scroll', positionWeatherTooltip, { passive: true, capture: true });
  const weatherKey=c=>c===0?'Clear sky':[1,2].includes(c)?'Mainly clear':c===3?'Overcast':[45,48].includes(c)?'Fog':[51,53,55,56,57].includes(c)?'Drizzle':[61,63,65,66,67,80,81,82].includes(c)?'Rain':[71,73,75,77,85,86].includes(c)?'Snow':[95,96,99].includes(c)?'Thunderstorm':'Weather conditions';
  function weatherSymbol(c){return c===0?'☀️':[1,2].includes(c)?'🌤️':c===3?'☁️':[45,48].includes(c)?'🌫️':[51,53,55,56,57].includes(c)?'🌦️':[61,63,65,66,67,80,81,82].includes(c)?'🌧️':[71,73,75,77,85,86].includes(c)?'❄️':[95,96,99].includes(c)?'⛈️':'🌡️';}
  const wt=k=>window.PrivateSpeedDialI18n?.t(k)||k;
  const weatherGeocodingLanguage=()=>({en:'en',pt:'pt',es:'es',fr:'fr',de:'de'})[window.PrivateSpeedDialI18n?.language]||'en';
  const searchbarWeatherTextColor=()=>getComputedStyle(document.documentElement).getPropertyValue('--searchbar-text').trim()||'#1d1d1f';
  function applyWeatherTextColor(color){if(!weatherWidget)return;const resolved=String(color||searchbarWeatherTextColor()||'#1d1d1f').trim();weatherWidget.style.setProperty('color',resolved,'important');[weatherCityLabel,weatherIcon,weatherTemp].forEach(el=>el?.style.setProperty('color',resolved,'important'));}
  function paintWeather(d){if(!weatherWidget||!d||!Number.isFinite(Number(d.temperature)))return;const city=String(d.city||weatherDefaults.weatherCity).trim().split(',')[0].trim();weatherCityLabel.textContent=city;weatherIcon.textContent=weatherSymbol(Number(d.code));const unit=window.__psdWeatherUnit||'metric';const temp=Number(d.temperature);const shown=unit==='imperial'?Math.round(temp*9/5+32):Math.round(temp);weatherTemp.textContent=`${shown}º${unit==='imperial'?'F':'C'}`;weatherWidget.hidden=false;weatherWidget.setAttribute('aria-label',`${city}: ${shown}º${unit==='imperial'?'F':'C'}`);const daily=d.daily||{},locale=({en:'en-US',pt:'pt-PT',es:'es-ES',fr:'fr-FR',de:'de-DE'})[window.PrivateSpeedDialI18n?.language]||'en-US';const rows=(daily.time||[]).slice(0,7).map((day,i)=>{const label=new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric'}).format(new Date(day+'T12:00:00'));const code=Number(daily.weather_code?.[i]);return `<div class="weather-day"><span class="weather-day-name">${label}</span><span class="weather-day-prediction">${weatherSymbol(code)} ${wt(weatherKey(code))}</span><span class="weather-day-temp">${Math.round(unit==='imperial'?Number(daily.temperature_2m_max?.[i])*9/5+32:Number(daily.temperature_2m_max?.[i]))}º <span>${Math.round(unit==='imperial'?Number(daily.temperature_2m_min?.[i])*9/5+32:Number(daily.temperature_2m_min?.[i]))}º</span></span></div>`}).join('');weatherTooltip.innerHTML=`<div class="weather-tip-topline"><div class="weather-tip-heading">${wt('Weather forecast')}</div><button type="button" class="weather-refresh-button" aria-label="${wt('Refresh weather')}" title="${wt('Refresh weather')}">🔄</button></div><div class="weather-current"><span class="weather-current-icon">${weatherSymbol(Number(d.code))}</span><div><div class="weather-current-label">${wt('Current conditions')}</div><div class="weather-current-condition">${wt(weatherKey(Number(d.code)))}</div></div><strong>${shown}º${unit==='imperial'?'F':'C'}</strong></div><div class="weather-tip-subtitle">${wt('Next 7 days')}</div><div class="weather-days">${rows||wt('Forecast unavailable')}</div><div class="weather-source-credit">${wt('Data from Open-Meteo')}</div>`;weatherTooltip.querySelector('.weather-refresh-button')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.currentTarget.classList.add('is-refreshing');fetchWeather(true);});}
  async function fetchWeather(force=false){if(!weatherWidget)return;if(weatherRequestInProgress){if(force)weatherRefreshPending=true;return;}weatherRequestInProgress=true;try{const p=await chrome.storage.local.get({...weatherDefaults,weatherCache:null,weatherPlace:null});window.__psdWeatherUnit=p.weatherUnit||'metric';const city=String(p.weatherCity||weatherDefaults.weatherCity).trim(),interval=Math.max(5,Math.min(720,Number(p.weatherIntervalMinutes)||30));if(weatherCitySetting&&document.activeElement!==weatherCitySetting)weatherCitySetting.value=city;if(weatherIntervalSetting)weatherIntervalSetting.value=String(interval);if(weatherUnitSetting)weatherUnitSetting.value=p.weatherUnit||'metric';const c=p.weatherCache,fresh=c&&Number.isFinite(Number(c.latitude))&&Number.isFinite(Number(c.longitude))&&String(c.cityQuery||c.city||'').toLowerCase()===city.toLowerCase()&&Date.now()-Number(c.fetchedAt||0)<interval*60000;if(!force&&fresh){paintWeather(c);return;}let place=p.weatherPlace&&String(p.weatherPlace.label||'').toLowerCase()===city.toLowerCase()?p.weatherPlace:null;if(!place){const gr=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=8&language=${weatherGeocodingLanguage()}&format=json`);if(!gr.ok)throw Error('Geocoding failed');const places=(await gr.json()).results||[];place=places.find(x=>String(x.name||'').toLowerCase()===city.toLowerCase())||places[0];}if(!place)throw Error('City not found');const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=7`);if(!r.ok)throw Error('Weather request failed');const w=await r.json(),result={city:place.name,cityQuery:city,latitude:Number(place.latitude),longitude:Number(place.longitude),temperature:w.current?.temperature_2m,code:w.current?.weather_code,daily:w.daily,fetchedAt:Date.now()};if(!Number.isFinite(Number(result.temperature)))throw Error('Weather data unavailable');await chrome.storage.local.set({weatherCache:result});paintWeather(result);}catch(e){console.warn('Private Speed Dial weather:',e.message);try{const {weatherCache}=await chrome.storage.local.get(['weatherCache']);if(weatherCache)paintWeather(weatherCache);}catch(_){}}finally{weatherRequestInProgress=false;if(weatherRefreshPending){weatherRefreshPending=false;fetchWeather(true);}}}
  function hideWeatherSuggestions(){if(weatherCitySuggestions){weatherCitySuggestions.hidden=true;weatherCitySuggestions.replaceChildren();}weatherCitySetting?.setAttribute('aria-expanded','false');}
  function selectWeatherSuggestion(place){const city=String(place.name||'').trim();if(!city)return;const label=[place.name,place.admin1,place.country].filter((v,i,a)=>v&&a.indexOf(v)===i).join(', ');weatherCitySetting.value=label;hideWeatherSuggestions();weatherCitySetting.blur();if(weatherCityLabel)weatherCityLabel.textContent=city;if(weatherWidget)weatherWidget.hidden=false;weatherRequestInProgress=false;weatherRefreshPending=false;chrome.storage.local.set({weatherCity:label,weatherPlace:{...place,label},weatherCache:null});}
  async function suggestWeatherCities(query){if(!weatherCitySuggestions||query.trim().length<2){hideWeatherSuggestions();return;}try{weatherSuggestController?.abort();weatherSuggestController=new AbortController();const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`,{signal:weatherSuggestController.signal});if(!response.ok)throw Error('City suggestions unavailable');const places=(await response.json()).results||[];if(query.trim()!==weatherCitySetting.value.trim())return;weatherCitySuggestions.replaceChildren();for(const place of places){const button=document.createElement('button');button.type='button';button.className='weather-city-suggestion';button.role='option';button.textContent=[place.name,place.admin1,place.country].filter((v,i,a)=>v&&a.indexOf(v)===i).join(', ');button.addEventListener('click',()=>selectWeatherSuggestion(place));weatherCitySuggestions.append(button);}if(!places.length){const empty=document.createElement('div');empty.className='weather-city-suggestions-empty';empty.textContent=wt('No cities found');weatherCitySuggestions.append(empty);}weatherCitySuggestions.hidden=false;weatherCitySetting.setAttribute('aria-expanded','true');}catch(error){if(error.name!=='AbortError')hideWeatherSuggestions();}}
  weatherCitySetting?.addEventListener('input',()=>{clearTimeout(weatherSuggestTimer);weatherSuggestTimer=setTimeout(()=>suggestWeatherCities(weatherCitySetting.value),250);});
  weatherCitySetting?.addEventListener('focus',()=>{if(weatherCitySetting.value.trim().length>=2)suggestWeatherCities(weatherCitySetting.value);});
  weatherCitySetting?.addEventListener('blur',()=>setTimeout(hideWeatherSuggestions,180));
  weatherUnitSetting?.addEventListener('change',async()=>{window.__psdWeatherUnit=weatherUnitSetting.value;await chrome.storage.local.set({weatherUnit:weatherUnitSetting.value});const {weatherCache}=await chrome.storage.local.get(['weatherCache']);if(weatherCache)paintWeather(weatherCache);});weatherCitySetting?.addEventListener('change',async()=>{const city=weatherCitySetting.value.trim()||weatherDefaults.weatherCity;await chrome.storage.local.set({weatherCity:city,weatherPlace:null});fetchWeather(true);});weatherCitySetting?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();weatherCitySetting.blur();}});weatherIntervalSetting?.addEventListener('change',async()=>{await chrome.storage.local.set({weatherIntervalMinutes:Math.max(5,Math.min(720,Number(weatherIntervalSetting.value)||30))});fetchWeather(true);});
  chrome.storage.onChanged.addListener((c,area)=>{if(area==='local'){if(c.searchbarFontColor)applyWeatherTextColor(c.searchbarFontColor.newValue);if(c.weatherCity){const next=String(c.weatherCity.newValue||weatherDefaults.weatherCity);if(weatherCitySetting&&document.activeElement!==weatherCitySetting)weatherCitySetting.value=next;if(weatherCityLabel)weatherCityLabel.textContent=next.split(',')[0].trim();if(c.weatherCity.oldValue!==c.weatherCity.newValue){chrome.storage.local.set({weatherCache:null});fetchWeather(true);}}if(c.weatherUnit){window.__psdWeatherUnit=c.weatherUnit.newValue||'metric';chrome.storage.local.get(['weatherCache'],r=>{if(r.weatherCache)paintWeather(r.weatherCache);});}}});chrome.storage.local.get({...weatherDefaults,weatherCache:null,searchbarFontColor:'#1d1d1f'},p=>{if(weatherCitySetting)weatherCitySetting.value=p.weatherCity||weatherDefaults.weatherCity;if(weatherIntervalSetting)weatherIntervalSetting.value=String(p.weatherIntervalMinutes||30);window.__psdWeatherUnit=p.weatherUnit||'metric';if(weatherUnitSetting)weatherUnitSetting.value=window.__psdWeatherUnit;applyWeatherTextColor(p.searchbarFontColor);if(p.weatherCache)paintWeather(p.weatherCache);fetchWeather(false);});

  const darkThemeToggle = null;
  function applyDarkTheme(enabled) {
    const active = Boolean(enabled);
    document.body.classList.toggle('dark-theme', active);
    document.documentElement.classList.toggle('psd-startup-dark', active);
    document.documentElement.classList.toggle('psd-startup-light', !active);
    document.documentElement.style.colorScheme = active ? 'dark' : 'light';
    try { localStorage.setItem('psd-dark-theme-hint', active ? '1' : '0'); } catch (_) {}
    if (darkThemeToggle) darkThemeToggle.checked = active;
  }
  const darkThemeColorPalette = {
    'bg-color-picker': '#1c1e22',
    'vignette-color-picker': '#000000',
    'glow-color-picker': '#a8c7fa',
    'dial-background-color': '#424242',
    'dial-border-color': '#777c89',
    'dial-title-color': '#f5f5f7',
    'dial-icon-glow-color': '#a8c7fa',
    'clock-color': '#f5f5f7',
    'date-color': '#b8bbc4',
    'button-font-color': '#f5f5f7',
    'button-glow-color': '#a8c7fa',
    'separator-color': '#414550',
    'dial-button-separator-color': '#414550'
  };
  function readColorPalette() {
    return Object.fromEntries(Object.keys(darkThemeColorPalette).map(id => {
      const input = document.getElementById(id);
      return [id, input?.value || darkThemeColorPalette[id]];
    }));
  }
  function applyColorPalette(palette) {
    Object.entries(palette || {}).forEach(([id, color]) => {
      const input = document.getElementById(id);
      if (input && /^#[0-9a-f]{6}$/i.test(color || '')) input.value = color;
    });
    // Actualiza também o preenchimento visual dos selectores personalizados.
    window.syncColorPickerSwatches?.();
    // Reaplica as cores aos elementos reais e guarda as preferências associadas.
    if (typeof saveClockPreferences === 'function') saveClockPreferences();
    const glowColor = document.getElementById('glow-color-picker')?.value || '#a8c7fa';
    const glowOpacity = document.getElementById('glow-opacity')?.value ?? 10;
    if (typeof applyGlowSettings === 'function') applyGlowSettings(glowColor, glowOpacity, true);
    const vignette = document.getElementById('vignette-color-picker');
    if (typeof applyVignette === 'function') {
      applyVignette({ enabled: document.getElementById('vignette-enabled')?.checked, color: vignette?.value, size: document.getElementById('vignette-size')?.value, opacity: document.getElementById('vignette-opacity')?.value }, true);
    }
  }

  const shortcutsContainer = document.getElementById('shortcuts-container');
  const dialRows = document.getElementById('dial-rows');
  const bgColorPicker = document.getElementById('bg-color-picker');
  const glowColorPicker = document.getElementById('glow-color-picker');
  const glowOpacityInput = document.getElementById('glow-opacity');
  const glowOpacityValue = document.getElementById('glow-opacity-value');
  const glowEnabled = document.getElementById('glow-enabled');
  const vignetteEnabled = document.getElementById('vignette-enabled');
  const vignetteColor = document.getElementById('vignette-color-picker');
  const vignetteSize = document.getElementById('vignette-size');
  const vignetteOpacity = document.getElementById('vignette-opacity');
  function applyVignette(settings, persist = false) {
    const enabled = Boolean(settings.enabled);
    const color = /^#[0-9a-f]{6}$/i.test(settings.color || '') ? settings.color : '#000000';
    const size = Math.max(5, Math.min(100, Number(settings.size ?? 45)));
    const opacity = Math.max(0, Math.min(100, Number(settings.opacity ?? 45)));
    document.documentElement.style.setProperty('--vignette-color', color);
    document.documentElement.style.setProperty('--vignette-size', `${size}%`);
    document.documentElement.style.setProperty('--vignette-opacity', enabled ? String(opacity / 100) : '0');
    if (vignetteEnabled) vignetteEnabled.checked = enabled;
    if (vignetteColor) vignetteColor.value = color;
    if (vignetteSize) vignetteSize.value = String(size);
    if (vignetteOpacity) vignetteOpacity.value = String(opacity);
    const sizeLabel = document.getElementById('vignette-size-value');
    const opacityLabel = document.getElementById('vignette-opacity-value');
    if (sizeLabel) sizeLabel.textContent = `${size}%`;
    if (opacityLabel) opacityLabel.textContent = `${opacity}%`;
    if (persist) safeSyncSet({ vignetteEnabled: enabled, vignetteColor: color, vignetteSize: size, vignetteOpacity: opacity });
  }


  const customizeBtn = document.getElementById('customize-btn');
  const controlsPanel = document.getElementById('controls-panel');
  const controlsBackdrop = document.getElementById('controls-backdrop');

  const editModal = document.getElementById('edit-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalName = document.getElementById('modal-name');
  const modalUrl = document.getElementById('modal-url');
  const modalCancel = document.getElementById('modal-cancel');
  const modalDone = document.getElementById('modal-done');

  const clockWidget = document.querySelector('.clock-widget');
  const dateOrderInput = document.getElementById('date-order');
  const clockDateDistanceInput = document.getElementById('clock-date-distance');
  const clockTime = document.getElementById('clock-time');
  const clockDate = document.getElementById('clock-date');
  const clockDialSeparator = document.getElementById('clock-dial-separator');
  const separatorColor = document.getElementById('separator-color');
  const separatorOpacity = document.getElementById('separator-opacity');
  const separatorThickness = document.getElementById('separator-thickness');
  const separatorVertical = document.getElementById('separator-vertical');
  const dialButtonSeparator = document.getElementById('dial-button-separator');
  const dialButtonSeparatorColor = document.getElementById('dial-button-separator-color');
  const dialButtonSeparatorOpacity = document.getElementById('dial-button-separator-opacity');
  const dialButtonSeparatorThickness = document.getElementById('dial-button-separator-thickness');
  const dialButtonSeparatorVertical = document.getElementById('dial-button-separator-vertical');
  const clockFontFamily = document.getElementById('clock-font-family');
  const clockFontSize = document.getElementById('clock-font-size');
  const clockFontWeight = document.getElementById('clock-font-weight');
  const dateFontFamily = document.getElementById('date-font-family');
  const dateFontSize = document.getElementById('date-font-size');
  const dateFontWeight = document.getElementById('date-font-weight');
  const clockColor = document.getElementById('clock-color');
  const clock24HourInput = document.getElementById('clock-24-hour');
  const dateColor = document.getElementById('date-color');
  const clockVertical = document.getElementById('clock-vertical');
  const dateVertical = document.getElementById('date-vertical');
  const clockHorizontal = document.getElementById('clock-horizontal');
  const dateHorizontal = document.getElementById('date-horizontal');
  const buttonHorizontal = document.getElementById('button-horizontal');
  const buttonVertical = document.getElementById('button-vertical');
  const buttonLabel = document.getElementById('button-label');
  let buttonLabelCustom = false;
  const buttonWidth = document.getElementById('button-width');
  const buttonHeight = document.getElementById('button-height');
  const buttonShape = document.getElementById('button-shape');
  const buttonBackgroundColor = document.getElementById('button-background-color');
  const buttonOpacity = document.getElementById('button-opacity');
  const dialTitleGap = document.getElementById('dial-title-gap');
  const dialMaxWidth = document.getElementById('dial-max-width');
  const dialGridHeight = document.getElementById('dial-grid-height');
  const dialGridLinesOpacity = document.getElementById('dial-grid-lines-opacity');
  const dialEntryDuration = document.getElementById('dial-entry-duration');
  const dialFadeEnabled = document.getElementById('dial-fade-enabled');
  const dialPhoneEnabled = document.getElementById('dial-phone-enabled');
  const dialPhoneDuration = document.getElementById('dial-phone-duration');
  const dialIconGlowColor = document.getElementById('dial-icon-glow-color');
  const dialIconGlowOpacity = document.getElementById('dial-icon-glow-opacity');
  const dialIconGlowSize = document.getElementById('dial-icon-glow-size');
  const dialColumns = document.getElementById('dial-columns');
  const dialIconSize = document.getElementById('dial-icon-size');
  const dialFaviconSize = document.getElementById('dial-favicon-size');
  const dialShape = document.getElementById('dial-shape');
  const dialFaviconShape = document.getElementById('dial-favicon-shape');
  const dialBackgroundColor = document.getElementById('dial-background-color');
  const dialBorderColor = document.getElementById('dial-border-color');
  const dialBorderThickness = document.getElementById('dial-border-thickness');
  const dialBorderOpacity = document.getElementById('dial-border-opacity');
  const dialTitleSize = document.getElementById('dial-title-size');
  const dialTitleFontFamily = document.getElementById('dial-title-font-family');
  const dialTitleColor = document.getElementById('dial-title-color');
  const buttonFontFamily = document.getElementById('button-font-family');
  const buttonFontSize = document.getElementById('button-font-size');
  const buttonFontColor = document.getElementById('button-font-color');
  const buttonGlowSize = document.getElementById('button-glow-size');
  const buttonGlowOpacity = document.getElementById('button-glow-opacity');
  const buttonGlowColor = document.getElementById('button-glow-color');
  const rangeValuePairs = [
    ['clock-vertical', 'clock-vertical-value', ' px'], ['clock-horizontal', 'clock-horizontal-value', ' px'], ['clock-date-distance', 'clock-date-distance-value', ''], ['separator-opacity', 'separator-opacity-value', '%'], ['separator-thickness', 'separator-thickness-value', ' px'], ['separator-vertical', 'separator-vertical-value', ' px'], ['dial-button-separator-opacity', 'dial-button-separator-opacity-value', '%'], ['dial-button-separator-thickness', 'dial-button-separator-thickness-value', ' px'], ['dial-button-separator-vertical', 'dial-button-separator-vertical-value', ' px'],
    ['button-width', 'button-width-value', ' px'], ['button-height', 'button-height-value', ' px'], ['button-vertical', 'button-vertical-value', ' px'], ['dial-title-gap', 'dial-title-gap-value', ' px'], ['dial-max-width', 'dial-max-width-value', ' px'], ['dial-grid-height', 'dial-grid-height-value', ' px'], ['dial-grid-lines-opacity', 'dial-grid-lines-opacity-value', '%'], ['dial-shape', 'dial-shape-value', '%'], ['dial-favicon-shape', 'dial-favicon-shape-value', '%'], ['dial-icon-size', 'dial-icon-size-value', ' px'], ['dial-favicon-size', 'dial-favicon-size-value', ' px'], ['dial-border-thickness', 'dial-border-thickness-value', ' px'], ['dial-border-opacity', 'dial-border-opacity-value', '%'], ['dial-entry-duration', 'dial-entry-duration-value', ' ms'], ['dial-phone-duration', 'dial-phone-duration-value', ' ms'], ['dial-icon-glow-opacity', 'dial-icon-glow-opacity-value', '%'], ['dial-icon-glow-size', 'dial-icon-glow-size-value', ' px'], ['button-glow-size', 'button-glow-size-value', ' px'], ['button-glow-opacity', 'button-glow-opacity-value', '%']
  ];
  function updateRangeLabels() {
    rangeValuePairs.forEach(([inputId, outputId, suffix]) => {
      const input = document.getElementById(inputId);
      const output = document.getElementById(outputId);
      if (input && output) output.textContent = `${input.value}${suffix}`;
    });
  }
  rangeValuePairs.forEach(([inputId]) => {
    const input = document.getElementById(inputId);
    input?.addEventListener('input', updateRangeLabels);
    input?.addEventListener('change', updateRangeLabels);
  });
  function updateMaterialSliderProgress(input) {
    if (!input || input.type !== 'range') return;
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || 0);
    const ratio = max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
    // Alignar o preenchimento com o centro do thumb, compensando a largura do indicador.
    const thumb = 18;
    const width = input.clientWidth || 0;
    const progressPx = width > thumb ? (thumb / 2) + ((width - thumb) * ratio) : (width * ratio);
    input.style.setProperty('--slider-progress', `${ratio * 100}%`);
    input.style.setProperty('--slider-progress-px', `${progressPx}px`);
  }
  function updateAllMaterialSliderProgress() {
    document.querySelectorAll('input[type="range"]').forEach(updateMaterialSliderProgress);
  }

  // Alguns sliders estão dentro do painel de personalização, inicialmente oculto.
  // Só depois de o painel ser apresentado é que o browser calcula a largura real.
  function scheduleMaterialSliderProgressUpdate() {
    requestAnimationFrame(() => requestAnimationFrame(updateAllMaterialSliderProgress));
  }

  document.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('input', () => updateMaterialSliderProgress(input));
    input.addEventListener('change', () => updateMaterialSliderProgress(input));
  });

  // Keep every slider's filled track synchronised with its actual value, including
  // values restored programmatically from saved settings after initial page load.
  scheduleMaterialSliderProgressUpdate();
  window.addEventListener('load', scheduleMaterialSliderProgressUpdate);
  window.addEventListener('pageshow', scheduleMaterialSliderProgressUpdate);
  window.addEventListener('resize', scheduleMaterialSliderProgressUpdate);
  window.addEventListener('transitionend', (event) => {
    if (event.target === controlsPanel || controlsPanel?.contains(event.target)) {
      scheduleMaterialSliderProgressUpdate();
    }
  }, true);
  // Recalculate when controls are revealed or their layout changes (e.g. settings tabs).
  if (typeof ResizeObserver !== 'undefined') {
    const sliderLayoutObserver = new ResizeObserver(() => scheduleMaterialSliderProgressUpdate());
    document.querySelectorAll('input[type="range"]').forEach((input) => sliderLayoutObserver.observe(input));
  }
  // Saved settings may populate range values asynchronously; sync after those updates.
  [0, 50, 150, 300, 600, 1000].forEach((delay) => setTimeout(scheduleMaterialSliderProgressUpdate, delay));

  if (!shortcutsContainer || !dialRows ||
      !customizeBtn || !controlsPanel ||
      !editModal || !modalTitle || !modalName || !modalUrl || !modalCancel || !modalDone ||
      !clockTime || !clockDate) {
    console.error('Missing required DOM elements.');
    return;
  }

  const DEFAULT_COUNT = 10;
  let shortcutCount = DEFAULT_COUNT;
  let dialRowsCount = 2;
  let shortcuts = [];
  let editingIndex = null;
  let currentTheme = 'light';
  let lastFocusedElement = null;
  let suppressDialClick = false;
  let activeDrag = null;

  const FALLBACK_ICON_URL = chrome.runtime.getURL('icon48.png');

  // ===== Clock =====
  // Use the selected interface language for the locale, with a user-controlled hour cycle.
  function getClockLocale() {
    return ({ pt: 'pt-PT', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' })[document.documentElement.lang] || document.documentElement.lang || 'en-US';
  }

  function updateClock() {
    const now = new Date();
    const locale = getClockLocale();
    const use24Hour = clock24HourInput ? clock24HourInput.checked : document.documentElement.lang !== 'en';
    const timeParts = new Intl.DateTimeFormat(locale, use24Hour
      ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
      : { hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(now);
    clockTime.replaceChildren();
    timeParts.forEach((part) => {
      if (!use24Hour && part.type === 'dayPeriod') {
        const period = document.createElement('span');
        period.className = 'clock-period';
        period.textContent = now.getHours() < 12 ? 'a.m.' : 'p.m.';
        clockTime.appendChild(period);
      } else if (part.type !== 'dayPeriod') {
        clockTime.appendChild(document.createTextNode(part.value));
      }
    });
    clockDate.textContent = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    clockDate.textContent = clockDate.textContent.charAt(0).toLocaleUpperCase(locale) + clockDate.textContent.slice(1);
  }

  // Refresh immediately when the selected interface language changes.
  document.addEventListener('change', (event) => {
    if (event.target?.id === 'language-select') updateClock();
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.privateSpeedDialLanguage) updateClock();
  });

  function startClock() {
    updateClock();
    // Sync to the next minute boundary, then tick every 60s
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    setTimeout(() => {
      updateClock();
      setInterval(updateClock, 60000);
    }, msUntilNextMinute);
  }

  // ===== Theme Presets (Apple HIG-inspired colors) =====
  const THEMES = {
    dark: {
      name: 'Escuro',
      preview: '#1c1e22',
      vars: {
        '--bg-color': '#1c1e22',
        '--bg-image': 'none',
        '--text-color': '#f5f5f7',
        '--text-secondary': '#aeaeb2',
        '--search-bg': '#fff',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': '#d2d2d7',
        '--card-bg': '#2c2c2e',
        '--card-bg-hover': '#3a3a3c',
        '--card-border': '#38383a',
        '--accent': '#5e9eff',
        '--accent-hover': '#4a8ae8',
        '--overlay-opacity': '0',
        '--text-shadow': 'none',
        '--hover-bg': 'rgba(255,255,255,0.18)',
        '--hover-bg-active': 'rgba(255,255,255,0.28)',
      }
    },
    light: {
      name: 'Claro',
      preview: '#f5f5f7',
      vars: {
        '--bg-color': '#f5f5f7',
        '--bg-image': 'none',
        '--text-color': '#1d1d1f',
        '--text-secondary': '#86868b',
        '--search-bg': '#fff',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': '#d2d2d7',
        '--card-bg': '#ffffff',
        '--card-bg-hover': '#f2f2f7',
        '--card-border': '#d2d2d7',
        '--accent': '#4a90d9',
        '--accent-hover': '#3d7cc0',
        '--overlay-opacity': '0',
        '--text-shadow': 'none',
        '--hover-bg': 'rgba(0,0,0,0.10)',
        '--hover-bg-active': 'rgba(0,0,0,0.16)',
      }
    },
    tahoe: {
      name: 'Tahoe',
      preview: 'linear-gradient(160deg, #0a2e52, #1565c0, #42a5f5, #c8b88a)',
      vars: {
        '--bg-color': '#0a2e52',
        '--bg-image': 'linear-gradient(160deg, #0a2e52 0%, #1565c0 35%, #42a5f5 65%, #c8b88a 100%)',
        '--text-color': '#ffffff',
        '--text-secondary': '#b0bec5',
        '--search-bg': 'rgba(255,255,255,0.92)',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': 'transparent',
        '--card-bg': '#0e3460',
        '--card-bg-hover': '#14406e',
        '--card-border': '#1a4d7a',
        '--accent': '#42a5f5',
        '--accent-hover': '#1e88e5',
        '--overlay-opacity': '0',
        '--text-shadow': '0 1px 4px rgba(0,0,0,0.6)',
        '--hover-bg': 'rgba(255,255,255,0.18)',
        '--hover-bg-active': 'rgba(255,255,255,0.28)',
      }
    },
    sequoia: {
      name: 'Sequoia',
      preview: 'linear-gradient(160deg, #12124a, #8c2056, #c05020, #d4960a)',
      vars: {
        '--bg-color': '#12124a',
        '--bg-image': 'linear-gradient(160deg, #12124a 0%, #8c2056 35%, #c05020 65%, #d4960a 100%)',
        '--text-color': '#ffffff',
        '--text-secondary': '#c0a0a0',
        '--search-bg': 'rgba(255,255,255,0.92)',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': 'transparent',
        '--card-bg': '#1a1a56',
        '--card-bg-hover': '#252564',
        '--card-border': '#333370',
        '--accent': '#e8a040',
        '--accent-hover': '#d49020',
        '--overlay-opacity': '0',
        '--text-shadow': '0 1px 4px rgba(0,0,0,0.7)',
        '--hover-bg': 'rgba(255,255,255,0.18)',
        '--hover-bg-active': 'rgba(255,255,255,0.28)',
      }
    },
    sonoma: {
      name: 'Sonoma',
      preview: 'linear-gradient(160deg, #0d3b0d, #2e7d32, #7cb342, #c8a415)',
      vars: {
        '--bg-color': '#0d3b0d',
        '--bg-image': 'linear-gradient(160deg, #0d3b0d 0%, #2e7d32 35%, #7cb342 65%, #c8a415 100%)',
        '--text-color': '#ffffff',
        '--text-secondary': '#a5c8a0',
        '--search-bg': 'rgba(255,255,255,0.92)',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': 'transparent',
        '--card-bg': '#154515',
        '--card-bg-hover': '#1e5a1e',
        '--card-border': '#2a6a2a',
        '--accent': '#7cb342',
        '--accent-hover': '#689b38',
        '--overlay-opacity': '0',
        '--text-shadow': '0 1px 4px rgba(0,0,0,0.7)',
        '--hover-bg': 'rgba(255,255,255,0.18)',
        '--hover-bg-active': 'rgba(255,255,255,0.28)',
      }
    },
    monterey: {
      name: 'Monterey',
      preview: 'linear-gradient(160deg, #1a0533, #4a148c, #7b1fa2, #ce93d8)',
      vars: {
        '--bg-color': '#1a0533',
        '--bg-image': 'linear-gradient(160deg, #1a0533 0%, #4a148c 35%, #7b1fa2 65%, #ce93d8 100%)',
        '--text-color': '#f5f5f7',
        '--text-secondary': '#c0a0c8',
        '--search-bg': 'rgba(255,255,255,0.92)',
        '--search-text': '#1d1d1f',
        '--search-placeholder': '#86868b',
        '--search-border': 'transparent',
        '--card-bg': '#220a40',
        '--card-bg-hover': '#2e1450',
        '--card-border': '#3d2060',
        '--accent': '#ce93d8',
        '--accent-hover': '#ba68c8',
        '--overlay-opacity': '0',
        '--text-shadow': '0 1px 4px rgba(0,0,0,0.6)',
        '--hover-bg': 'rgba(255,255,255,0.18)',
        '--hover-bg-active': 'rgba(255,255,255,0.28)',
      }
    },
  };

  const CUSTOM_THEME_VARS = {
    '--bg-color': '#1c1c1e',
    '--text-color': '#ffffff',
    '--text-secondary': '#aeaeb2',
    '--search-bg': 'rgba(255,255,255,0.88)',
    '--search-text': '#1d1d1f',
    '--search-placeholder': '#86868b',
    '--search-border': 'transparent',
    '--card-bg': '#2c2c2e',
    '--card-bg-hover': '#3a3a3c',
    '--card-border': '#38383a',
    '--accent': '#5e9eff',
    '--accent-hover': '#4a8ae8',
    '--overlay-opacity': '0.4',
    '--text-shadow': '0 1px 4px rgba(0,0,0,0.7)',
    '--hover-bg': 'rgba(255,255,255,0.18)',
    '--hover-bg-active': 'rgba(255,255,255,0.28)',
  };

  // ===== Theme Functions =====
  function applyThemeVars(vars) {
    const root = document.documentElement;
    for (const [prop, value] of Object.entries(vars)) {
      root.style.setProperty(prop, value);
    }
  }

  function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    currentTheme = themeName;
    applyThemeVars(theme.vars);
    updateSwatchActive(themeName);
  }

  function applyGlowSettings(color, opacity, persist = false) {
    const safeColor = /^#[0-9a-f]{6}$/i.test(color) ? color : '#a8c7fa';
    const safeOpacity = Math.max(0, Math.min(100, Number.isFinite(Number(opacity)) ? Number(opacity) : 10));
    document.documentElement.style.setProperty('--glow-color', safeColor);
    document.documentElement.style.setProperty('--glow-opacity', String(safeOpacity / 100));
    const enabled = glowEnabled ? glowEnabled.checked : true;
    document.documentElement.style.setProperty('--glow-enabled-opacity', enabled ? '1' : '0');
    if (glowColorPicker) glowColorPicker.value = safeColor;
    if (glowOpacityInput) glowOpacityInput.value = String(safeOpacity);
    if (glowOpacityValue) glowOpacityValue.textContent = `${safeOpacity}%`;
    if (persist) safeSyncSet({ glowColor: safeColor, glowOpacity: safeOpacity, glowEnabled: enabled });
  }

  function updateSwatchActive(themeName) {
    document.querySelectorAll('.theme-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === themeName);
    });
  }

  function saveTheme(themeName) {
    safeSyncSet({ theme: themeName });
  }

  function loadTheme() {
    chrome.storage.local.get(['glowColor', 'glowOpacity', 'glowEnabled'], (result) => {
      applyDarkTheme(false);
      applyGlowSettings(result.glowColor || '#a8c7fa', result.glowOpacity ?? 10);
      document.documentElement.style.setProperty('--bg-color', '#ffffff');
      document.documentElement.style.setProperty('--bg-image', 'none');
      document.body.style.setProperty('background-color', 'transparent', 'important');
      document.body.style.setProperty('background-image', 'none', 'important');
      const backgroundLayer = document.getElementById('page-background-layer');
      if (backgroundLayer) {
        backgroundLayer.style.setProperty('background-color', '#ffffff', 'important');
        backgroundLayer.style.setProperty('background-image', 'none', 'important');
      }
      try {
        localStorage.setItem('psd-dark-theme-hint', '0');
        localStorage.setItem('psd-bg-mode-hint', 'default-color');
        localStorage.setItem('psd-bg-color-hint', '#ffffff');
        localStorage.removeItem('psd-custom-bg-image-hint');
      } catch (_) {}
      chrome.storage.local.remove(['customBgImage', 'customBgColor', 'darkTheme']);
      saveTheme('light');
      window.syncColorPickerSwatches?.();
    });
  }

  // ===== Shortcut Functions =====
  function normalizeUrl(raw) {
    const value = (raw || '').trim();
    if (!value) return '';
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) return value;
    return `https://${value}`;
  }

  function titleFromUrl(url) {
    try {
      const u = new URL(url);
      return (u.hostname || '').replace(/^www\./, '') || url;
    } catch {
      return url;
    }
  }

  function applyClockPreferences(prefs = {}) {
    const apply = (el, family, size, weight, defaults) => {
      const f = prefs[family] || defaults.family;
      el.style.fontFamily = f === 'system' ? '' : f;
      el.style.fontSize = `${Math.max(defaults.min, Math.min(defaults.max, Number(prefs[size]) || defaults.size))}px`;
      el.style.fontWeight = String(prefs[weight] || defaults.weight);
    };
    apply(clockTime, 'clockFontFamily', 'clockFontSize', 'clockFontWeight', { family: 'system', size: 82, weight: 300, min: 24, max: 180 });
    apply(clockDate, 'dateFontFamily', 'dateFontSize', 'dateFontWeight', { family: 'system', size: 17, weight: 400, min: 10, max: 60 });
    if (clockFontFamily) clockFontFamily.value = prefs.clockFontFamily || 'system';
    if (clockFontSize) clockFontSize.value = String(prefs.clockFontSize || 82);
    if (clockFontWeight) clockFontWeight.value = String(prefs.clockFontWeight || 300);
    if (dateFontFamily) dateFontFamily.value = prefs.dateFontFamily || 'system';
    if (dateFontSize) dateFontSize.value = String(prefs.dateFontSize || 17);
    if (dateFontWeight) dateFontWeight.value = String(prefs.dateFontWeight || 400);
    clockTime.style.display = prefs.hideClock ? 'none' : '';
    clockDate.style.display = prefs.hideDate ? 'none' : '';
    const hideClockInput = document.getElementById('hide-clock'); if (hideClockInput) hideClockInput.checked = !prefs.hideClock;
    const hideDateInput = document.getElementById('hide-date'); if (hideDateInput) hideDateInput.checked = !prefs.hideDate;
    clockTime.style.color = prefs.clockColor || '#1d1d1f';
    clockDate.style.color = prefs.dateColor || '#68686d';
    const sepColor = /^#[0-9a-f]{6}$/i.test(prefs.separatorColor || '') ? prefs.separatorColor : '#8b8b95';
    const sepOpacity = Math.max(0, Math.min(100, Number(prefs.separatorOpacity ?? 55)));
    const sepThickness = Math.max(1, Math.min(12, Number(prefs.separatorThickness ?? 2)));
    if (clockDialSeparator) {
      clockDialSeparator.style.setProperty('--clock-dial-separator-color', sepColor);
      clockDialSeparator.style.setProperty('--clock-dial-separator-opacity', String(sepOpacity / 100));
      clockDialSeparator.style.setProperty('--clock-dial-separator-thickness', `${sepThickness}px`);
      clockDialSeparator.style.display = sepOpacity === 0 ? 'none' : '';
    }
    if (separatorColor) separatorColor.value = sepColor;
    if (separatorOpacity) separatorOpacity.value = String(sepOpacity);
    if (separatorThickness) separatorThickness.value = String(sepThickness);
    const sepVertical = Number(prefs.separatorVertical) || 0;
    if (clockDialSeparator) clockDialSeparator.style.transform = `translateY(${sepVertical}px)`;
    if (separatorVertical) separatorVertical.value = String(sepVertical);
    const lowerSepColor = /^#[0-9a-f]{6}$/i.test(prefs.dialButtonSeparatorColor || '') ? prefs.dialButtonSeparatorColor : '#8b8b95';
    const lowerSepOpacity = Math.max(0, Math.min(100, Number(prefs.dialButtonSeparatorOpacity ?? 55)));
    const lowerSepThickness = Math.max(1, Math.min(12, Number(prefs.dialButtonSeparatorThickness ?? 2)));
    const lowerSepVertical = Number(prefs.dialButtonSeparatorVertical) || 0;
    if (dialButtonSeparator) {
      dialButtonSeparator.style.setProperty('--clock-dial-separator-color', lowerSepColor);
      dialButtonSeparator.style.setProperty('--clock-dial-separator-opacity', String(lowerSepOpacity / 100));
      dialButtonSeparator.style.setProperty('--clock-dial-separator-thickness', `${lowerSepThickness}px`);
      dialButtonSeparator.style.transform = `translateY(${lowerSepVertical}px)`;
      dialButtonSeparator.style.display = lowerSepOpacity === 0 ? 'none' : '';
    }
    if (dialButtonSeparatorColor) dialButtonSeparatorColor.value = lowerSepColor;
    if (dialButtonSeparatorOpacity) dialButtonSeparatorOpacity.value = String(lowerSepOpacity);
    if (dialButtonSeparatorThickness) dialButtonSeparatorThickness.value = String(lowerSepThickness);
    if (dialButtonSeparatorVertical) dialButtonSeparatorVertical.value = String(lowerSepVertical);
    const clockY = Number(prefs.clockVertical) || 0;
    const clockX = Math.max(-1920, Math.min(1920, Number(prefs.clockHorizontal) || 0));
    if (clockWidget) { clockWidget.style.setProperty('transform', `translate(${clockX}px, ${clockY}px)`, 'important'); const distance = Math.max(-10, Math.min(10, Number(prefs.clockDateDistance ?? 0))); clockWidget.style.gap = `${Math.max(0, distance + 10)}px`; if (clockDate) clockDate.style.marginTop = distance < 0 ? `${distance}px` : '0px'; }
    if (clockDate) { const above = (prefs.dateOrder || 'below') === 'above'; clockDate.style.order = above ? '-1' : '1'; clockTime.style.order = above ? '1' : '-1'; }
    const clockAlignment = ['left','center','right'].includes(prefs.clockAlignment) ? prefs.clockAlignment : 'left';
    if (clockWidget) { clockWidget.style.alignItems = clockAlignment === 'left' ? 'flex-start' : clockAlignment === 'right' ? 'flex-end' : 'center'; clockWidget.style.textAlign = clockAlignment === 'left' ? 'left' : clockAlignment === 'right' ? 'right' : 'center'; }
    document.querySelectorAll('[data-clock-alignment]').forEach(btn => { const active = btn.dataset.clockAlignment === (clockAlignment === 'center' ? 'center' : clockAlignment); btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active)); });
    if (clockHorizontal) clockHorizontal.value = String(clockX);
    if (dateOrderInput) dateOrderInput.value = prefs.dateOrder || 'below';
    if (clockDateDistanceInput) clockDateDistanceInput.value = String(Math.max(-10, Math.min(10, Number(prefs.clockDateDistance ?? 0))));
    const storedButtonLabel = typeof prefs.buttonLabel === 'string' ? prefs.buttonLabel : '';
    const legacyDefaultButtonLabels = ['Settings', 'Definições', 'Ajustes', 'Paramètres', 'Einstellungen', 'Personalizar', 'Customize', 'Personnaliser', 'Anpassen', 'Botón Personalizar'];
    const hasExplicitCustomLabelState = typeof prefs.buttonLabelCustom === 'boolean';
    const isCustomButtonLabel = hasExplicitCustomLabelState
      ? Boolean(prefs.buttonLabelCustom && storedButtonLabel.trim())
      : Boolean(storedButtonLabel.trim() && !legacyDefaultButtonLabels.includes(storedButtonLabel.trim()));
    buttonLabelCustom = isCustomButtonLabel;
    const localizedDefaultButtonLabel = window.PrivateSpeedDialI18n?.t('Settings') || 'Settings';
    if (buttonLabel) buttonLabel.dataset.customLabel = String(isCustomButtonLabel);
    if (customizeBtn) customizeBtn.dataset.customLabel = String(isCustomButtonLabel);
    customizeBtn.textContent = isCustomButtonLabel ? storedButtonLabel : localizedDefaultButtonLabel;
    // Never rewrite the value while the user is editing it; this prevents every keystroke
    // (especially clearing the field to replace the default) from being overwritten.
    if (buttonLabel && document.activeElement !== buttonLabel) {
      buttonLabel.value = isCustomButtonLabel ? storedButtonLabel : localizedDefaultButtonLabel;
    }
    customizeBtn.style.setProperty('--button-vertical-offset', `${Number(prefs.buttonVertical) || 0}px`);
    const buttonX = Math.max(-1920, Math.min(1920, Number(prefs.buttonHorizontal) || 0));
    customizeBtn.style.setProperty('--button-horizontal-offset', `${buttonX}px`);
    if (buttonHorizontal) buttonHorizontal.value = String(buttonX);
    const btnWidth = Math.max(80, Math.min(400, Number(prefs.buttonWidth ?? 120)));
    const btnHeight = Math.max(30, Math.min(160, Number(prefs.buttonHeight ?? 40)));
    customizeBtn.style.setProperty('--customize-button-width', `${btnWidth}px`);
    customizeBtn.style.setProperty('--customize-button-height', `${btnHeight}px`);
    if (buttonWidth) buttonWidth.value = String(btnWidth);
    if (buttonHeight) buttonHeight.value = String(btnHeight);
    const shapeValue = Math.max(0, Math.min(100, Number(prefs.buttonShape ?? 50))); if (buttonShape) buttonShape.value = String(shapeValue); const shapeOutput = document.getElementById('button-shape-value'); if (shapeOutput) shapeOutput.textContent = `${shapeValue}%`; customizeBtn.style.borderRadius = `${shapeValue * 0.36}px`; const bgValue = prefs.buttonBackgroundColor || '#f2f2f3'; if (buttonBackgroundColor) buttonBackgroundColor.value = bgValue; const bgOpacity = Math.max(0, Math.min(100, Number(prefs.buttonOpacity ?? 100))); if (buttonOpacity) buttonOpacity.value = String(bgOpacity); const bgOpacityOutput = document.getElementById('button-opacity-value'); if (bgOpacityOutput) bgOpacityOutput.textContent = `${bgOpacity}%`; const buttonBgMatch = /^#([0-9a-f]{6})$/i.exec(bgValue); const buttonBgHex = buttonBgMatch ? buttonBgMatch[1] : 'f2f2f3'; customizeBtn.style.backgroundColor = `rgba(${parseInt(buttonBgHex.slice(0,2),16)}, ${parseInt(buttonBgHex.slice(2,4),16)}, ${parseInt(buttonBgHex.slice(4,6),16)}, ${bgOpacity / 100})`;
    const titleGap = Math.max(-10, Math.min(10, Number(prefs.dialTitleGap ?? 0)));
    shortcutsContainer.style.setProperty('--dial-title-gap', `${titleGap}px`);
    const iconSize = Math.max(10, Math.min(400, Number(prefs.dialIconSize ?? 64)));
    const faviconSize = Math.max(8, Math.min(400, Number(prefs.dialFaviconSize ?? 48)));
    const dialShapeValue = Math.max(0, Math.min(100, Number(prefs.dialShape ?? 0)));
    shortcutsContainer.style.setProperty('--dial-icon-size', `${iconSize}px`);
    shortcutsContainer.style.setProperty('--dial-favicon-size', `${faviconSize}px`);
    shortcutsContainer.style.setProperty('--dial-corner-radius', `${50 - dialShapeValue / 2}%`);
    const faviconShapeValue = Math.max(0, Math.min(100, Number(prefs.dialFaviconShape ?? 0)));
    shortcutsContainer.style.setProperty('--favicon-corner-radius', `${faviconShapeValue / 2}%`);
    shortcutsContainer.style.setProperty('--dial-shadow-blur', `${iconSize * 0.1875}px`);
    if (dialIconSize) dialIconSize.value = String(iconSize);
    if (dialFaviconSize) dialFaviconSize.value = String(faviconSize);
    if (dialShape) dialShape.value = String(dialShapeValue);
    if (dialFaviconShape) dialFaviconShape.value = String(faviconShapeValue);
    const dialBgColor = /^#[0-9a-f]{6}$/i.test(prefs.dialBackgroundColor || '') ? prefs.dialBackgroundColor : '#ffffff';
    shortcutsContainer.style.setProperty('--dial-background-color', dialBgColor);
    const bgMatch = dialBgColor.match(/[a-f0-9]{2}/gi) || ['ff','ff','ff'];
    const bgRgb = bgMatch.map(part => parseInt(part, 16));
    const bgLuminance = (0.2126 * bgRgb[0] + 0.7152 * bgRgb[1] + 0.0722 * bgRgb[2]) / 255;
    shortcutsContainer.style.setProperty('--dial-add-plus-color', bgLuminance < 0.48 ? '#f5f5f7' : '#636366');
    if (dialBackgroundColor) dialBackgroundColor.value = dialBgColor;
    const borderColor = /^#[0-9a-f]{6}$/i.test(prefs.dialBorderColor || '') ? prefs.dialBorderColor : '#8b8b95';
    const borderThickness = Math.max(0, Math.min(10, Number(prefs.dialBorderThickness ?? 0)));
    const borderOpacity = Math.max(0, Math.min(100, Number(prefs.dialBorderOpacity ?? 100)));
    const borderRgb = borderColor.match(/[a-f0-9]{2}/gi).map(part => parseInt(part, 16));
    shortcutsContainer.style.setProperty('--dial-border-color', `rgba(${borderRgb[0]}, ${borderRgb[1]}, ${borderRgb[2]}, ${borderOpacity / 100})`);
    shortcutsContainer.style.setProperty('--dial-border-thickness', `${borderThickness}px`);
    if (dialBorderColor) dialBorderColor.value = borderColor;
    if (dialBorderThickness) dialBorderThickness.value = String(borderThickness);
    if (dialBorderOpacity) dialBorderOpacity.value = String(borderOpacity);
    // A sombra é calculada diretamente em CSS a partir do tamanho real do ícone.
    const titleSize = Math.max(8, Math.min(24, Number(prefs.dialTitleSize ?? 12)));
    shortcutsContainer.style.setProperty('--dial-title-size', `${titleSize}px`);
    const titleFontFamily = prefs.dialTitleFontFamily || 'system';
    shortcutsContainer.style.setProperty('--dial-title-font-family', titleFontFamily === 'system' ? 'inherit' : titleFontFamily);
    if (dialTitleFontFamily) dialTitleFontFamily.value = titleFontFamily;
    if (dialTitleSize) dialTitleSize.value = String(titleSize);
    const titleColor = prefs.dialTitleColor || '#1d1d1f';
    shortcutsContainer.style.setProperty('--dial-title-color', titleColor);
    if (dialTitleColor) dialTitleColor.value = titleColor;
    if (clockColor) clockColor.value = prefs.clockColor || '#1d1d1f';
    if (dateColor) dateColor.value = prefs.dateColor || '#68686d';
    if (clockVertical) clockVertical.value = String(Number(prefs.clockVertical) || 0);
    if (buttonVertical) buttonVertical.value = String(Number(prefs.buttonVertical) || 0);
    if (dialTitleGap) dialTitleGap.value = String(Math.max(-10, Math.min(10, Number(prefs.dialTitleGap ?? 0))));
    const columns = Math.max(1, Math.min(10, Number(prefs.dialColumns) || 5));
    const rows = Math.max(1, Math.min(10, Number(prefs.dialRows) || 2));
    dialRowsCount = rows;
    if (dialRows) dialRows.value = String(rows);
    if (dialColumns) dialColumns.value = String(columns);
    shortcutsContainer.style.setProperty('--dial-columns', String(columns));
    const maxWidth = Math.max(100, Math.min(3840, Number(prefs.dialMaxWidth ?? 800)));
    // Cada célula deve acomodar o ícone e o título. A largura base configurada
    // mantém-se, mas a grelha cresce automaticamente se os ícones forem maiores.
    const minimumCellWidth = iconSize + 8; // 4 px de margem interna de cada lado
    const effectiveGridWidth = Math.round(Math.max(maxWidth, columns * minimumCellWidth));
    shortcutsContainer.style.setProperty('--dial-grid-width', `${effectiveGridWidth}px`);
    shortcutsContainer.style.width = `${effectiveGridWidth}px`;
    shortcutsContainer.style.minWidth = `${effectiveGridWidth}px`;
    shortcutsContainer.style.maxWidth = 'none';
    // Keep the grid geometrically centered even when its configured width
    // exceeds the viewport (auto margins alone stop centering in that case).
    shortcutsContainer.style.position = 'relative';
    shortcutsContainer.style.left = '50%';
    shortcutsContainer.style.transform = 'translateX(-50%)';
    shortcutsContainer.style.marginLeft = '0';
    shortcutsContainer.style.marginRight = '0';
    if (dialMaxWidth) dialMaxWidth.value = String(maxWidth);
    const gridHeight = Math.max(100, Math.min(1600, Number(prefs.dialGridHeight ?? 400)));
    const effectiveCellHeight = iconSize + titleSize * 1.2 + titleGap + 8;
    const effectiveGridHeight = Math.round(Math.max(gridHeight, rows * Math.max(iconSize + 8, effectiveCellHeight)));
    shortcutsContainer.style.setProperty('--dial-grid-height', `${effectiveGridHeight}px`);
    shortcutsContainer.style.height = `${effectiveGridHeight}px`;
    if (dialGridHeight) dialGridHeight.value = String(gridHeight);
    const gridLinesOpacity = Math.max(0, Math.min(100, Number(prefs.dialGridLinesOpacity ?? 0)));
    shortcutsContainer.style.setProperty('--dial-grid-lines-opacity', String(gridLinesOpacity / 100));
    if (dialGridLinesOpacity) dialGridLinesOpacity.value = String(gridLinesOpacity);
    const entryDuration = Math.max(0, Math.min(10000, Number(prefs.dialEntryDuration ?? 125)));
    const fadeEnabled = prefs.dialFadeEnabled !== false;
    const phoneEnabled = prefs.dialPhoneEnabled === true;
    const phoneDuration = Math.max(100, Math.min(1200, Number(prefs.dialPhoneDuration ?? 350)));
    const pageContent = document.getElementById('page-content');
    if (pageContent) { pageContent.classList.toggle('fade-in-enabled', fadeEnabled); pageContent.classList.toggle('phone-animation-enabled', phoneEnabled); pageContent.style.setProperty('--dial-phone-duration', `${phoneDuration}ms`); }
    if (dialFadeEnabled) dialFadeEnabled.checked = fadeEnabled;
    if (dialPhoneEnabled) dialPhoneEnabled.checked = phoneEnabled;
    if (dialPhoneDuration) dialPhoneDuration.value = String(phoneDuration);
    shortcutsContainer.style.setProperty('--dial-entry-duration', `${entryDuration}ms`);
    customizeBtn.style.setProperty('--dial-entry-duration', `${entryDuration}ms`);
    if (dialEntryDuration) dialEntryDuration.value = String(entryDuration);
    const iconGlowColor = /^#[0-9a-f]{6}$/i.test(prefs.dialIconGlowColor || '') ? prefs.dialIconGlowColor : '#9b5de5';
    const iconGlowOpacity = Math.max(0, Math.min(100, Number(prefs.dialIconGlowOpacity ?? 45)));
    const iconGlowSize = Math.max(0, Math.min(30, Number(prefs.dialIconGlowSize ?? 8)));
    shortcutsContainer.style.setProperty('--dial-icon-glow-color', iconGlowColor);
    shortcutsContainer.style.setProperty('--dial-icon-glow-opacity', String(iconGlowOpacity / 100));
    shortcutsContainer.style.setProperty('--dial-icon-click-glow-opacity', String(Math.min(100, iconGlowOpacity * 1.2) / 100));
    shortcutsContainer.style.setProperty('--dial-icon-glow-size', `${iconGlowSize}px`);
    if (dialIconGlowColor) dialIconGlowColor.value = iconGlowColor;
    if (dialIconGlowOpacity) dialIconGlowOpacity.value = String(iconGlowOpacity);
    if (dialIconGlowSize) dialIconGlowSize.value = String(iconGlowSize);
    customizeBtn.style.fontFamily = !prefs.buttonFontFamily || prefs.buttonFontFamily === 'system' ? '' : prefs.buttonFontFamily;
    customizeBtn.style.fontSize = `${Math.max(9, Math.min(28, Number(prefs.buttonFontSize) || 13))}px`;
    customizeBtn.style.color = prefs.buttonFontColor || '#1d1d1f';
    const buttonGlowOn = true;
    const buttonGlowBlur = Math.max(0, Math.min(60, Number(prefs.buttonGlowSize ?? 16)));
    const buttonGlowAlpha = Math.max(0, Math.min(100, Number(prefs.buttonGlowOpacity ?? 45)));
    const buttonGlowHex = /^#[0-9a-f]{6}$/i.test(prefs.buttonGlowColor || '') ? prefs.buttonGlowColor : '#9b5de5';
    customizeBtn.style.setProperty('--button-glow-shadow', buttonGlowOn && buttonGlowBlur > 0 && buttonGlowAlpha > 0 ? `0 0 ${buttonGlowBlur}px ${buttonGlowBlur / 3}px ${buttonGlowHex}${Math.round(buttonGlowAlpha * 2.55).toString(16).padStart(2, '0')}` : 'none');
    if (buttonGlowSize) buttonGlowSize.value = String(buttonGlowBlur);
    if (buttonGlowOpacity) buttonGlowOpacity.value = String(buttonGlowAlpha);
    if (buttonGlowColor) buttonGlowColor.value = buttonGlowHex;
    if (buttonFontFamily) buttonFontFamily.value = prefs.buttonFontFamily || 'system';
    if (buttonFontSize) buttonFontSize.value = String(Number(prefs.buttonFontSize) || 13);
    if (buttonFontColor) buttonFontColor.value = prefs.buttonFontColor || '#1d1d1f';
    updateRangeLabels();
  }

  function saveClockPreferences() {
    const prefs = {
      darkTheme: false,
      clockFontFamily: clockFontFamily.value, clockFontSize: Number(clockFontSize.value) || 82, clockFontWeight: Number(clockFontWeight.value) || 300,
      dateFontFamily: dateFontFamily.value, dateFontSize: Number(dateFontSize.value) || 17, dateFontWeight: Number(dateFontWeight.value) || 400,
      hideClock: !document.getElementById('hide-clock')?.checked, hideDate: !document.getElementById('hide-date')?.checked, clock24Hour: Boolean(clock24HourInput?.checked), clockColor: clockColor.value, dateColor: dateColor.value, separatorColor: separatorColor?.value || '#8b8b95', separatorOpacity: Number(separatorOpacity?.value ?? 55), separatorThickness: Number(separatorThickness?.value ?? 2), separatorVertical: Number(separatorVertical?.value ?? 0), dialButtonSeparatorColor: dialButtonSeparatorColor?.value || '#8b8b95', dialButtonSeparatorOpacity: Number(dialButtonSeparatorOpacity?.value ?? 55), dialButtonSeparatorThickness: Number(dialButtonSeparatorThickness?.value ?? 2), dialButtonSeparatorVertical: Number(dialButtonSeparatorVertical?.value ?? 0), clockVertical: Number(clockVertical.value) || 0, clockHorizontal: Number(clockHorizontal?.value ?? 0), dateOrder: dateOrderInput?.value || 'below', clockAlignment: document.querySelector('.clock-alignment-option.active')?.dataset.clockAlignment || 'left', clockDateDistance: Number(clockDateDistanceInput?.value ?? 8), buttonHorizontal: Number(buttonHorizontal?.value ?? 0), buttonVertical: Number(buttonVertical.value) || 0, buttonLabel: buttonLabelCustom && buttonLabel ? buttonLabel.value.slice(0, 60) : '', buttonLabelCustom: Boolean(buttonLabelCustom && buttonLabel?.value.trim()), buttonWidth: Number(buttonWidth?.value ?? 120), buttonHeight: Number(buttonHeight?.value ?? 40), buttonShape: Number(buttonShape?.value ?? 50), buttonOpacity: Number(buttonOpacity?.value ?? 100), buttonBackgroundColor: buttonBackgroundColor?.value || '#f2f2f3',
      dialColumns: String(Math.max(1, Math.min(10, Number(dialColumns.value) || 5))), dialRows: String(Math.max(1, Math.min(10, Number(dialRows?.value) || 2))), dialGridHeight: Number(dialGridHeight?.value ?? 400), dialTitleGap: Number(dialTitleGap?.value ?? 0), dialMaxWidth: Number(dialMaxWidth?.value ?? 800), dialGridLinesOpacity: Number(dialGridLinesOpacity?.value ?? 0), dialShape: Number(dialShape?.value ?? 0), dialFaviconShape: Number(dialFaviconShape?.value ?? 0), dialEntryDuration: Number(dialEntryDuration?.value ?? 125), dialFadeEnabled: Boolean(dialFadeEnabled?.checked), dialPhoneEnabled: Boolean(dialPhoneEnabled?.checked), dialPhoneDuration: Number(dialPhoneDuration?.value ?? 350), dialIconGlowColor: dialIconGlowColor?.value || '#9b5de5', dialIconGlowOpacity: Number(dialIconGlowOpacity?.value ?? 45), dialIconGlowSize: Number(dialIconGlowSize?.value ?? 8), dialIconSize: Number(dialIconSize?.value ?? 64), dialFaviconSize: Number(dialFaviconSize?.value ?? 48), dialBackgroundColor: dialBackgroundColor?.value || '#ffffff', dialBorderColor: dialBorderColor?.value || '#8b8b95', dialBorderThickness: Number(dialBorderThickness?.value ?? 0), dialBorderOpacity: Number(dialBorderOpacity?.value ?? 100), dialTitleSize: Number(dialTitleSize?.value ?? 12), dialTitleFontFamily: dialTitleFontFamily?.value || 'system', dialTitleColor: dialTitleColor?.value || '#1d1d1f', buttonFontFamily: buttonFontFamily.value, buttonFontSize: Number(buttonFontSize.value) || 13, buttonFontColor: buttonFontColor.value, buttonGlowEnabled: true, buttonGlowSize: Number(buttonGlowSize?.value ?? 16), buttonGlowOpacity: Number(buttonGlowOpacity?.value ?? 45), buttonGlowColor: buttonGlowColor?.value || '#9b5de5'
    };
    applyClockPreferences(prefs);
    clearTimeout(preferenceSaveTimer);
    preferenceSaveTimer = setTimeout(() => safeSyncSet(prefs), 500);
  }

  // v93: atualizar opacidade sem uma animação de entrada a sobrepor o slider.
  [separatorOpacity, dialButtonSeparatorOpacity].forEach((input) => {
    input?.addEventListener('input', () => {
      const isUpper = input === separatorOpacity;
      const element = isUpper ? clockDialSeparator : dialButtonSeparator;
      if (!element) return;
      const value = Math.max(0, Math.min(100, Number(input.value) || 0));
      element.style.setProperty('--clock-dial-separator-opacity', String(value / 100));
      element.style.opacity = String(value / 100);
      element.style.display = value === 0 ? 'none' : '';
      element.style.animation = 'none';
    });
  });


  buttonShape?.addEventListener('input', () => { const v=Number(buttonShape.value)||0; const out=document.getElementById('button-shape-value'); if(out) out.textContent=`${v}%`; customizeBtn.style.borderRadius=`${v*0.36}px`; saveClockPreferences(); });
  buttonBackgroundColor?.addEventListener('input', () => { customizeBtn.style.backgroundColor=buttonBackgroundColor.value; saveClockPreferences(); });
  // A non-empty value explicitly entered by the user is a custom label, even if it
  // happens to equal a translated default such as "Settings" or "Definições".
  buttonLabel?.addEventListener('input', () => {
    const enteredLabel = buttonLabel.value.slice(0, 60);
    buttonLabelCustom = Boolean(enteredLabel.trim());
    buttonLabel.dataset.customLabel = String(buttonLabelCustom);
    if (customizeBtn) {
      customizeBtn.dataset.customLabel = String(buttonLabelCustom);
      // Update the visible button immediately as the user types. When the field
      // is empty, show the selected language's default label instead.
      customizeBtn.textContent = buttonLabelCustom
        ? enteredLabel
        : (window.PrivateSpeedDialI18n?.t('Settings') || 'Settings');
      customizeBtn.setAttribute('aria-label', customizeBtn.textContent);
    }
    saveClockPreferences();
  });
  buttonLabel?.addEventListener('change', saveClockPreferences);
  buttonLabel?.addEventListener('blur', () => {
    if (!buttonLabel.value.trim()) {
      buttonLabelCustom = false;
      buttonLabel.dataset.customLabel = 'false';
      if (customizeBtn) customizeBtn.dataset.customLabel = 'false';
      const defaultButtonLabel = window.PrivateSpeedDialI18n?.t('Settings') || 'Settings';
      buttonLabel.value = defaultButtonLabel;
      if (customizeBtn) {
        customizeBtn.textContent = defaultButtonLabel;
        customizeBtn.setAttribute('aria-label', defaultButtonLabel);
      }
      saveClockPreferences();
    }
  });

  [dialFadeEnabled, dialPhoneEnabled, dialPhoneDuration, clockFontFamily, clockFontSize, clockFontWeight, dateFontFamily, dateFontSize, dateFontWeight, separatorColor, separatorOpacity, separatorThickness, separatorVertical, dialButtonSeparatorColor, dialButtonSeparatorOpacity, dialButtonSeparatorThickness, dialButtonSeparatorVertical, clockColor, dateColor, clockVertical, dateVertical, buttonVertical, buttonWidth, buttonHeight, buttonShape, buttonBackgroundColor, buttonOpacity, dialTitleGap, dialMaxWidth, dialGridHeight, dialGridLinesOpacity, dialShape, dialFaviconShape, dialEntryDuration, dialIconGlowColor, dialIconGlowOpacity, dialIconGlowSize, dialColumns, dialRows, buttonFontFamily, buttonFontSize, buttonFontColor, buttonGlowSize, buttonGlowOpacity, buttonGlowColor, dialIconSize, dialFaviconSize, dialBackgroundColor, dialBorderColor, dialBorderThickness, dialBorderOpacity, dialTitleSize, dialTitleFontFamily, dialTitleColor].forEach(el => {
    el?.addEventListener('input', saveClockPreferences);
    el?.addEventListener('change', saveClockPreferences);
  });
  // Pré-visualiza a duração escolhida reiniciando a animação de entrada dos dials.
  dialEntryDuration?.addEventListener('input', () => applyEntryAnimationToTiles(true));
  [dialFadeEnabled, dialPhoneEnabled, dialPhoneDuration].forEach(el => { el?.addEventListener('input', () => { saveClockPreferences(); applyEntryAnimationToTiles(true); }); el?.addEventListener('change', () => { saveClockPreferences(); applyEntryAnimationToTiles(true); }); });

  function applyEntryAnimationToTiles(restart = false) {
    const duration = Math.max(0, Math.min(10000, Number(dialEntryDuration?.value ?? 125)));
    const phoneDuration = Math.max(100, Math.min(1200, Number(dialPhoneDuration?.value ?? 350)));
    const pageContent = document.getElementById('page-content');
    if (pageContent) { pageContent.style.setProperty('--dial-phone-duration', `${phoneDuration}ms`); pageContent.classList.toggle('fade-in-enabled', Boolean(dialFadeEnabled?.checked)); pageContent.classList.toggle('phone-animation-enabled', Boolean(dialPhoneEnabled?.checked)); }
    document.documentElement.style.setProperty('--dial-entry-duration', `${duration}ms`);
    if (shortcutsContainer) {
      shortcutsContainer.style.setProperty('--dial-entry-duration', `${duration}ms`);
      shortcutsContainer.classList.remove('dials-entering');
    }
    if (restart && document.body.classList.contains('preferences-ready')) {
      // Reinicia apenas a camada de conteúdo dos dials. O popup e o backdrop
      // estão fora desta camada e não recebem a animação nem a sua opacidade.
      const page = document.getElementById('page-content');
      if (page) {
        page.classList.remove('page-entering');
        void page.offsetWidth;
        page.classList.add('page-entering');
      }
    }
  }

  function loadData() {
    chrome.storage.local.get(['shortcutCount', 'shortcuts', 'clockFontFamily', 'clockFontSize', 'clockFontWeight', 'dateFontFamily', 'dateFontSize', 'dateFontWeight', 'clockColor', 'dateColor', 'clockVertical', 'dateVertical', 'clockHorizontal', 'dateHorizontal', 'buttonHorizontal', 'buttonVertical', 'buttonLabel', 'buttonWidth', 'buttonHeight', 'buttonShape', 'buttonOpacity', 'buttonBackgroundColor', 'dialTitleGap', 'dialMaxWidth', 'dialGridHeight', 'dialGridLinesOpacity', 'dialShape', 'dialFaviconShape', 'dialEntryDuration', 'dialFadeEnabled', 'dialPhoneEnabled', 'dialPhoneDuration', 'dialIconGlowColor', 'dialIconGlowOpacity', 'dialIconGlowSize', 'dialColumns', 'dialRows', 'dialIconSize', 'dialFaviconSize', 'dialBackgroundColor', 'dialBorderColor', 'dialBorderThickness', 'dialBorderOpacity', 'dialTitleSize', 'dialTitleFontFamily', 'dialTitleColor', 'buttonFontFamily', 'buttonFontSize', 'buttonFontColor', 'buttonGlowSize', 'buttonGlowOpacity', 'buttonGlowColor', 'hideClock', 'hideDate', 'clock24Hour', 'clockAlignment', 'dateOrder', 'clockDateDistance', 'separatorColor', 'separatorOpacity', 'separatorThickness', 'separatorVertical', 'dialButtonSeparatorColor', 'dialButtonSeparatorOpacity', 'dialButtonSeparatorThickness', 'dialButtonSeparatorVertical', 'glowSize', 'glowPosition', 'darkTheme'], (result) => {
      if (clock24HourInput) clock24HourInput.checked = result.clock24Hour ?? (document.documentElement.lang !== 'en');
      updateClock();
      applyDarkTheme(false);
      chrome.storage.local.get(Object.keys(searchbarDefaults), applySearchbar);
      // Aplicar todas as preferências e construir os dials antes de revelar
      // os divisores: evita que apareçam durante o layout inicial e depois saltem.
      applyClockPreferences(result);
      shortcuts = Array.isArray(result.shortcuts) ? result.shortcuts : [];
      const savedColumns = Math.max(1, Math.min(10, Number(result.dialColumns) || 5));
      dialRowsCount = Math.max(1, Math.min(10, Number(result.dialRows) || Math.ceil((Number(result.shortcutCount) || DEFAULT_COUNT) / savedColumns)));
      shortcutCount = savedColumns * dialRowsCount;
      if (shortcuts.length < shortcutCount) shortcuts.length = shortcutCount;
      render();
      // Esperar dois frames garante que fontes, dimensões da grelha e offsets
      // guardados já foram calculados antes de mostrar os divisores.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.body.classList.add('preferences-ready');
        // Background fade was removed from the Animations settings. Do not call
        // the deleted function here: a ReferenceError prevented both page-element
        // entry animations from being initialised on each new tab.
        // Run the independent page-element animation after preferences are ready.
        applyEntryAnimationToTiles(true);
      }));
    });
  }

  function saveData() {
    const columns = Math.max(1, Math.min(10, Number(dialColumns?.value) || 5));
    const rows = Math.max(1, Math.min(10, Number(dialRows?.value) || dialRowsCount || 2));
    shortcutCount = columns * rows;
    if (shortcuts.length < shortcutCount) shortcuts.length = shortcutCount;
    safeSyncSet({ shortcutCount, shortcuts, dialColumns: String(columns), dialRows: String(rows) });
  }

  function closeMenus() {
    document.querySelectorAll('.menu.active').forEach(m => {
      m.classList.remove('active');
      m.setAttribute('aria-expanded', 'false');
      m.closest('.shortcut')?.classList.remove('menu-open');
    });
    document.querySelectorAll('.menu-options.is-top-layer').forEach(options => {
      options.classList.remove('is-top-layer');
      options.style.left = '';
      options.style.top = '';
      if (options._ownerTile) options._ownerTile.appendChild(options);
    });
  }

  function openEditModal(index, existing) {
    lastFocusedElement = document.activeElement;
    editingIndex = index;
    modalTitle.textContent = existing ? 'Editar atalho' : 'Adicionar atalho';
    modalName.value = existing?.title || '';
    modalUrl.value = existing?.url || '';
    editModal.classList.remove('hidden');
    modalName.focus();
  }

  function closeEditModal() {
    editModal.classList.add('hidden');
    editingIndex = null;
    modalName.value = '';
    modalUrl.value = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // Cache persistente de imagens em IndexedDB: sobrevive ao fecho dos separadores
  // e evita voltar a pedir à Internet os ícones que já foram obtidos.
  const faviconUrlCache = new Map();
  const iconFetchesInFlight = new Map();
  let iconDbPromise;
  function openIconDb() {
    if (iconDbPromise) return iconDbPromise;
    iconDbPromise = new Promise((resolve) => {
      if (!('indexedDB' in window)) return resolve(null);
      const request = indexedDB.open('speed-dial-flor-icon-cache', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('icons')) db.createObjectStore('icons');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    });
    return iconDbPromise;
  }
  async function getCachedIcon(url) {
    const db = await openIconDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const request = db.transaction('icons', 'readonly').objectStore('icons').get(url);
        request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
        request.onerror = () => resolve(null);
      } catch (_) { resolve(null); }
    });
  }
  async function cacheIcon(url) {
    if (!url || iconFetchesInFlight.has(url)) return iconFetchesInFlight.get(url);
    const task = (async () => {
      const db = await openIconDb();
      if (!db) return;
      try {
        const response = await fetch(url, { mode: 'cors', credentials: 'omit', cache: 'force-cache' });
        if (!response.ok) return;
        const blob = await response.blob();
        if (!blob.type.startsWith('image/') || blob.size > 2 * 1024 * 1024) return;
        await new Promise((resolve) => {
          try {
            const tx = db.transaction('icons', 'readwrite');
            tx.objectStore('icons').put(blob, url);
            tx.oncomplete = resolve;
            tx.onerror = resolve;
            tx.onabort = resolve;
          } catch (_) { resolve(); }
        });
      } catch (_) { /* Alguns servidores bloqueiam CORS; o ícone continua a funcionar remotamente. */ }
    })().finally(() => iconFetchesInFlight.delete(url));
    iconFetchesInFlight.set(url, task);
    return task;
  }
  function createFaviconImg(url, altText, customImageUrl) {
    const img = document.createElement('img');
    // O título já é apresentado num elemento separado. Não usar alt com o título,
    // porque o browser pode desenhá-lo dentro da imagem enquanto o favicon carrega.
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    // Impede o arrasto nativo da imagem, que cria uma imagem-fantasma por baixo
    // do preview personalizado do dial. O arrasto da célula continua a ser gerido
    // exclusivamente pelos eventos de ponteiro abaixo.
    img.draggable = false;
    img.setAttribute('draggable', 'false');
    img.classList.add('icon-loading');
    img.loading = 'eager';
    img.decoding = 'async';
    img.fetchPriority = 'high';
    img.addEventListener('load', () => {
      img.classList.remove('icon-loading');
    });

    let fallback = faviconUrlCache.get(url);
    if (!fallback) {
      fallback = `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(url)}`;
      if (faviconUrlCache.size > 200) faviconUrlCache.clear();
      faviconUrlCache.set(url, fallback);
    }

    // Preferir a cópia local; se ainda não existir, mostrar já a imagem remota e
    // guardá-la em segundo plano para os próximos separadores.
    let stage = customImageUrl ? 0 : 1;
    let activeUrl = stage === 0 ? customImageUrl : fallback;
    let failed = false;
    const setRemote = (remoteUrl) => {
      activeUrl = remoteUrl;
      img.src = remoteUrl;
      // Google favicon redirects (google.com/s2/favicons -> gstatic.com) do not
      // expose CORS headers. Do not fetch/cache that cross-origin response; assigning
      // it directly to img.src is supported by the browser and avoids a console error.
      if (!/^(?:https?:\/\/)?(?:www\.)?google\.com\/s2\/favicons/i.test(remoteUrl) && !/t[0-9]\.gstatic\.com\/favicon/i.test(remoteUrl)) cacheIcon(remoteUrl);
    };
    const showFromCacheOrRemote = async (targetUrl) => {
      const cached = await getCachedIcon(targetUrl);
      if (failed || !img.isConnected) return;
      if (cached) {
        img.src = URL.createObjectURL(cached);
      } else {
        setRemote(targetUrl);
      }
    };
    img.addEventListener('error', () => {
      if (stage === 0) {
        stage = 1;
        showFromCacheOrRemote(fallback);
      } else if (stage === 1) {
        stage = 2;
        activeUrl = FALLBACK_ICON_URL;
        img.src = FALLBACK_ICON_URL;
      } else {
        failed = true;
      }
    });
    showFromCacheOrRemote(activeUrl);
    return img;
  }

  function createShortcutTile(index, data) {
    const tile = document.createElement('div');
    tile.className = 'shortcut';
    tile.setAttribute('role', 'listitem');

    const title = String(data.title || '').trim().slice(0, 60);
    const url = (data.url || '').trim();
    const displayTitle = title || titleFromUrl(url);

    // Make the tile keyboard-accessible as a link
    tile.tabIndex = 0;
    tile.setAttribute('role', 'listitem');
    tile.setAttribute('aria-label', `${displayTitle} — ${url}`);

    const img = createFaviconImg(url, displayTitle, data.logoUrl);
    // A moldura representa a forma exterior do dial; o favicon mantém a sua forma independente.
    const iconFrame = document.createElement('div');
    iconFrame.className = 'dial-icon-frame';
    iconFrame.appendChild(img);
    const label = document.createElement('span');
    label.textContent = displayTitle;

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'button');
    menu.setAttribute('aria-label', `Opções de ${displayTitle}`);
    menu.setAttribute('aria-haspopup', 'true');
    menu.setAttribute('aria-expanded', 'false');
    menu.tabIndex = 0;
    // O menu é aberto exclusivamente com o botão direito do rato.

    const menuOptions = document.createElement('div');
    menuOptions.className = 'menu-options';
    menuOptions.setAttribute('role', 'menu');

    const optEdit = document.createElement('div');
    optEdit.className = 'option';
    optEdit.dataset.action = 'edit';
    optEdit.textContent = '✏️  Edit dial';
    optEdit.setAttribute('role', 'menuitem');
    optEdit.tabIndex = -1;

    const optRemove = document.createElement('div');
    optRemove.className = 'option';
    optRemove.dataset.action = 'remove';
    const optLogo = document.createElement('div');
    optLogo.className = 'option';
    optLogo.dataset.action = 'logo';
    optLogo.textContent = `🎨  Custom icon (paste image's URL)`;
    optLogo.setAttribute('role', 'menuitem');
    optLogo.tabIndex = -1;

    const optResetLogo = document.createElement('div');
    optResetLogo.className = 'option';
    optResetLogo.dataset.action = 'reset-logo';
    optResetLogo.textContent = `🔄  Restore site's favicon`;
    optResetLogo.setAttribute('role', 'menuitem');
    optResetLogo.tabIndex = -1;

    const optSearchLogo = document.createElement('div');
    optSearchLogo.className = 'option';
    optSearchLogo.dataset.action = 'search-logo';
    optSearchLogo.textContent = `🔎  Search for icon (copy image's URL)`;
    optSearchLogo.setAttribute('role', 'menuitem');
    optSearchLogo.tabIndex = -1;

    optRemove.textContent = '🗑️  Remove';
    optRemove.setAttribute('role', 'menuitem');
    optRemove.tabIndex = -1;

    const optThumbnail = document.createElement('div');
    optThumbnail.className = 'option';
    optThumbnail.dataset.action = 'grab-thumbnail';
    optThumbnail.textContent = '🖼️  Page thumbnail (wait for the new tab to close)';
    optThumbnail.setAttribute('role', 'menuitem');
    optThumbnail.tabIndex = -1;

    menuOptions.appendChild(optEdit);
    menuOptions.appendChild(optResetLogo);
    menuOptions.appendChild(optSearchLogo);
    menuOptions.appendChild(optLogo);
    menuOptions.appendChild(optThumbnail);
    menuOptions.appendChild(optRemove);

    tile.appendChild(iconFrame);
    tile.appendChild(label);
    tile.appendChild(menu);
    tile.appendChild(menuOptions);

    // O efeito começa no pointerdown, mantém-se enquanto o botão esquerdo
    // está premido e faz fade-out ao largar. A navegação não espera pela animação.
    const clearDialPress = () => {
      const icon = tile.querySelector('img');
      if (icon) icon.classList.remove('dial-press-anim');
    };
    tile.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.menu') || e.target.closest('.menu-options')) return;
      document.body.classList.add('dial-drag-active');
      const icon = tile.querySelector('img');
      if (icon) icon.classList.add('dial-press-anim');
      document.addEventListener('pointerup', clearDialPress, { once: true, capture: true });
      document.addEventListener('pointercancel', clearDialPress, { once: true, capture: true });
    });
    tile.addEventListener('pointercancel', clearDialPress);

    tile.addEventListener('click', (e) => {
      if (suppressDialClick) { e.preventDefault(); e.stopPropagation(); suppressDialClick = false; clearDialPress(); return; }
      if (e.target.closest('.menu') || e.target.closest('.menu-options')) return;
      shortcutsContainer.classList.remove('dials-entering');
      // Abrir o destino imediatamente ao largar o botão; sem temporizador.
      window.location.href = url;
    });

    // O botão do meio abre o atalho numa nova separadora em segundo plano.
    tile.addEventListener('auxclick', (e) => {
      if (e.button !== 1 || e.target.closest('.menu, .menu-options')) return;
      e.preventDefault();
      e.stopPropagation();
      if (chrome?.tabs?.create) {
        chrome.tabs.create({ url, active: false });
      } else {
        window.open(url, '_blank', 'noopener');
      }
    });

    // Navigate on Enter/Space when tile is focused
    tile.addEventListener('keydown', (e) => {
      if (e.target.closest('.menu') || e.target.closest('.menu-options')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = url;
      }
    });

    // Menu de contexto: abre com o botão direito sobre o dial.
    function toggleMenu() {
      document.querySelectorAll('.menu.active').forEach(m => {
        if (m !== menu) {
          m.classList.remove('active');
          m.setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = menu.classList.toggle('active');
      menu.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        optEdit.focus();
      }
    }

    menu.addEventListener('click', (e) => { e.stopPropagation(); });

    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = menu.classList.contains('active');
      closeMenus();
      if (!wasOpen) {
        menu.classList.add('active');
        menu.setAttribute('aria-expanded', 'true');
        tile.classList.add('menu-open');
        // Retira o menu do contexto de empilhamento do dial para ficar acima
        // de todos os dials, linhas da grelha e divisores.
        const rect = tile.getBoundingClientRect();
        menuOptions._ownerTile = tile;
        document.body.appendChild(menuOptions);
        menuOptions.classList.add('is-top-layer');
        // Measure the translated menu after it enters the top layer, then position
        // it using its actual language-dependent dimensions instead of fixed offsets.
        menuOptions.style.left = '8px';
        menuOptions.style.top = '8px';
        const menuRect = menuOptions.getBoundingClientRect();
        const margin = 8;
        const maxX = Math.max(margin, window.innerWidth - menuRect.width - margin);
        const maxY = Math.max(margin, window.innerHeight - menuRect.height - margin);
        const x = Math.min(Math.max(margin, e.clientX), maxX);
        const y = Math.min(Math.max(margin, e.clientY), maxY);
        menuOptions.style.left = `${x}px`;
        menuOptions.style.top = `${y}px`;
        optEdit.focus();
      }
    });

    // Menu keyboard navigation (arrow keys + Escape)
    menuOptions.addEventListener('keydown', (e) => {
      const items = [optEdit, optResetLogo, optSearchLogo, optLogo, optThumbnail, optRemove];
      const current = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(current + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(current - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        menu.classList.remove('active');
        menu.setAttribute('aria-expanded', 'false');
        menu.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.activeElement.click();
      }
    });

    optEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      openEditModal(index, data);
    });

    optThumbnail.addEventListener('click', async (e) => {
      e.stopPropagation();
      closeMenus();
      if (!url || !/^https?:\/\//i.test(url)) {
        window.alert('A page thumbnail requires a valid HTTP or HTTPS URL.');
        return;
      }
      try {
        // Request access only to the site whose thumbnail the user explicitly chose.
        // The permission request is made directly from this click handler so Chrome
        // can associate it with a user gesture.
        new URL(url); // Validate the target before asking for permission.
        const granted = await new Promise((resolve) => {
          // captureVisibleTab requires broad host access in Chrome. Ask only when
          // the user explicitly invokes this feature, not during installation.
          chrome.permissions.request({ origins: ['<all_urls>'] }, resolve);
        });
        if (!granted) throw new Error('Site access was not granted, so the page thumbnail was not captured. You can try again and allow access when Chrome asks.');
        const result = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ type: 'PSD_GRAB_THUMBNAIL', url }, response => {
            if (chrome.runtime.lastError) return reject(new Error(`Background capture service did not respond: ${chrome.runtime.lastError.message}. Open chrome://extensions, press Reload for Private Speed Dial, then try again. If it persists, open the extension's Service worker inspector and check for errors.`));
            if (!response?.ok) return reject(new Error(response?.error || 'The background capture failed without a reason.'));
            resolve(response);
          });
        });
        const image = await new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => reject(new Error('Chrome returned an unreadable screenshot.'));
          im.src = `data:image/png;base64,${result.data}`;
        });
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = 400; canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx || !side) throw new Error('The captured image has no usable dimensions.');
        ctx.drawImage(image, Math.floor((image.naturalWidth-side)/2), Math.floor((image.naturalHeight-side)/2), side, side, 0, 0, 400, 400);
        data.logoUrl = canvas.toDataURL('image/png');
        shortcuts[index] = data;
        saveData();
        render();
      } catch (err) {
        const reason = err?.message || String(err || 'Unknown error');
        console.error('Private Speed Dial: thumbnail capture failed.', err);
        window.alert(`Could not grab the page thumbnail. The existing icon was left unchanged.\n\nTechnical details: ${reason}`);
      }
    });

    optLogo.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      const current = data.logoUrl || '';
      const entered = window.prompt('Introduza o URL direto da imagem do logótipo (PNG, JPG, SVG ou WebP):', current);
      if (entered === null) return;
      const value = entered.trim();
      if (value && !/^https?:\/\//i.test(value)) {
        window.alert('O endereço da imagem deve começar por http:// ou https://.');
        return;
      }
      if (value) data.logoUrl = value; else delete data.logoUrl;
      shortcuts[index] = data;
      saveData();
      render();
    });

    optResetLogo.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      delete data.logoUrl;
      shortcuts[index] = data;
      saveData();
      render();
    });

    optSearchLogo.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      const siteName = displayTitle || titleFromUrl(url);
      const query = encodeURIComponent(siteName + ' logo');
      window.open('https://www.google.com/search?tbm=isch&q=' + query, '_blank', 'noopener');
    });

    optRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      shortcuts[index] = null;
      saveData();
      render();
    });

    return tile;
  }

  function createAddTile(index) {
    const tile = document.createElement('div');
    tile.className = 'shortcut add';
    tile.setAttribute('role', 'listitem');
    tile.tabIndex = 0;
    tile.setAttribute('aria-label', 'Novo');

    const addIcon = document.createElement('div');
    addIcon.className = 'add-icon';
    addIcon.setAttribute('aria-hidden', 'true');
    const plus = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    plus.setAttribute('class', 'plus');
    plus.setAttribute('viewBox', '0 0 24 24');
    plus.setAttribute('fill', 'none');
    plus.setAttribute('stroke', 'var(--dial-add-plus-color, #636366)');
    plus.setAttribute('stroke-width', '2.5');
    plus.setAttribute('stroke-linecap', 'round');

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '12'); line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '12'); line1.setAttribute('y2', '18');
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '6'); line2.setAttribute('y1', '12');
    line2.setAttribute('x2', '18'); line2.setAttribute('y2', '12');
    plus.appendChild(line1);
    plus.appendChild(line2);

    addIcon.appendChild(plus);

    const label = document.createElement('span');
    label.textContent = 'Novo';

    tile.appendChild(addIcon);
    tile.appendChild(label);

    tile.addEventListener('click', (e) => {
      if (suppressDialClick) { e.preventDefault(); e.stopPropagation(); suppressDialClick = false; return; }
      openEditModal(index, null);
    });
    tile.addEventListener('auxclick', (e) => {
      if (e.button === 1) e.preventDefault();
    });
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEditModal(index, null);
      }
    });
    return tile;
  }

  function render() {
    shortcutsContainer.innerHTML = '';
    const columnsForGrid = Math.max(1, Math.min(10, Number(dialColumns?.value) || Number(shortcutsContainer.style.getPropertyValue('--dial-columns')) || 5));
    const rowCount = Math.max(1, Math.min(10, Number(dialRows?.value) || dialRowsCount || 2));
    const capacity = columnsForGrid * rowCount;
    shortcutCount = capacity;
    shortcutsContainer.style.setProperty('--dial-rows', String(rowCount));

    for (let i = 0; i < capacity; i++) {
      const data = shortcuts[i];
      const hasData = data && typeof data === 'object' && (data.url || '').trim();
      const tile = hasData ? createShortcutTile(i, data) : createAddTile(i);
      tile.dataset.slot = String(i);
      shortcutsContainer.appendChild(tile);
      attachDialDrag(tile);
    }
  }

  // Reordenação por ponteiro com FLIP via Web Animations API.
  // Todas as células são móveis, incluindo as vazias (.shortcut.add): mover
  // uma célula vazia permite preservar espaços em branco entre atalhos.
  const activeDialFlipAnimations = new WeakMap();

  function attachDialDrag(tile) {
    tile.draggable = false;
    tile.dataset.movableCell = 'true';
    tile.addEventListener('dragstart', (e) => e.preventDefault());
    tile.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.menu, .menu-options')) return;
      const startX = e.clientX;
      const startY = e.clientY;
      const originTile = tile;
      let started = false;
      let preview = null;
      let startRect = null;
      let offsetX = 0;
      let offsetY = 0;
      let lastPointerX = startX;
      let lastPointerY = startY;
      let previousMoveY = startY;
      let previousMoveX = startX;
      let lastReorderAt = 0;

      const begin = () => {
        started = true;
        const pressedIcon = originTile.querySelector('img');
        if (pressedIcon) pressedIcon.classList.remove('dial-press-anim');
        document.body.classList.add('dial-drag-active');
        activeDrag = { tile: originTile };
        suppressDialClick = true;
        startRect = originTile.getBoundingClientRect();
        offsetX = startX - startRect.left;
        offsetY = startY - startRect.top;
        preview = originTile.cloneNode(true);
        preview.classList.remove('is-dragging');
        preview.classList.add('dial-drag-preview');
        preview.removeAttribute('id');
        preview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        preview.querySelectorAll('img').forEach(img => {
          img.draggable = false;
          img.setAttribute('draggable', 'false');
          img.classList.remove('dial-click-anim');
          img.style.removeProperty('opacity');
          img.style.removeProperty('animation');
        });
        Object.assign(preview.style, {
          position: 'fixed', left: `${startRect.left}px`, top: `${startRect.top}px`,
          width: `${startRect.width}px`, height: `${startRect.height}px`, margin: '0',
          transform: 'translate3d(0,0,0) scale(1.055)', transformOrigin: 'center center',
          pointerEvents: 'none', zIndex: '999999', opacity: '1'
        });
        document.body.appendChild(preview);
        originTile.classList.add('is-dragging');
      };

      const movePreview = (x, y) => {
        if (!preview || !startRect) return;
        const dx = x - startX;
        const dy = y - startY;
        preview.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.055)`;
      };

      const reorder = (target, before) => {
        const reference = before ? target : target.nextElementSibling;
        if (reference === originTile || (!reference && originTile === shortcutsContainer.lastElementChild)) return;

        // Limitar a reordenação à cadência aproximada do ecrã, sem o atraso
        // de 38 ms que fazia os dials de fundo saltarem atrás do ponteiro.
        const now = performance.now();
        if (now - lastReorderAt < 8) return;
        lastReorderAt = now;

        const siblings = [...shortcutsContainer.children].filter(el => el !== originTile);
        // FLIP consistente em ambos os eixos: capturar a posição efetivamente
        // visível antes de cancelar qualquer animação em curso.
        const oldRects = new Map(siblings.map(el => [el, el.getBoundingClientRect()]));
        for (const el of siblings) {
          const current = activeDialFlipAnimations.get(el);
          if (current) {
            // Remover a referência antes de cancelar para o callback antigo não
            // limpar a classe pertencente à animação nova.
            activeDialFlipAnimations.delete(el);
            current.cancel();
          }
          el.getAnimations().forEach(anim => anim.cancel());
        }
        shortcutsContainer.insertBefore(originTile, reference);

        for (const el of siblings) {
          const oldRect = oldRects.get(el);
          const newRect = el.getBoundingClientRect();
          const dx = oldRect.left - newRect.left;
          const dy = oldRect.top - newRect.top;
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            el.classList.remove('is-repositioning');
            continue;
          }
          // A classe é aplicada antes de iniciar a animação para impedir que regras
          // CSS de reset do transform interfiram. A mesma FLIP trata X e Y.
          el.classList.add('is-repositioning');
          const animation = el.animate([
            { transform: `translate3d(${dx}px, ${dy}px, 0)` },
            { transform: 'translate3d(0px, 0px, 0px)' }
          ], {
            duration: 260,
            easing: 'cubic-bezier(.2, .65, .25, 1)',
            fill: 'both',
            composite: 'replace'
          });
          activeDialFlipAnimations.set(el, animation);
          const cleanup = () => {
            if (activeDialFlipAnimations.get(el) !== animation) return;
            activeDialFlipAnimations.delete(el);
            el.classList.remove('is-repositioning');
          };
          animation.onfinish = cleanup;
          animation.oncancel = cleanup;
        }
      };

      const move = (ev) => {
        lastPointerX = ev.clientX;
        lastPointerY = ev.clientY;
        if (!started && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
        if (!started) begin();
        ev.preventDefault();
        movePreview(ev.clientX, ev.clientY);

        // Ignorar o preview porque é pointer-events:none; localizar o dial real.
        const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.shortcut[data-movable-cell="true"]');
        // Não filtrar .shortcut.add: uma célula vazia pode ser origem ou destino.
        if (!target || target === originTile || !shortcutsContainer.contains(target)) return;
        const rect = target.getBoundingClientRect();
        const midpointY = rect.top + rect.height / 2;
        const midpointX = rect.left + rect.width / 2;
        // Usar o eixo dominante do movimento evita que a grelha espere até
        // o ponteiro atravessar grande parte da célula. Na deslocação horizontal,
        // decide-se pela metade esquerda/direita; na vertical, pela metade
        // superior/inferior, incluindo mudanças de linha.
        const moveX = ev.clientX - previousMoveX;
        const moveY = ev.clientY - previousMoveY;
        const horizontalMove = Math.abs(moveX) >= Math.abs(moveY);
        const before = horizontalMove
          ? ev.clientX < midpointX
          : ev.clientY < midpointY;
        previousMoveX = ev.clientX;
        previousMoveY = ev.clientY;
        reorder(target, before);
      };

      const finish = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', finish);
        document.removeEventListener('pointercancel', finish);
        document.body.classList.remove('dial-drag-active');
        if (!started) return;
        if (preview) preview.remove();
        originTile.classList.remove('is-dragging');
        const previous = shortcuts.slice();
        const order = [...shortcutsContainer.children].map(el => Number(el.dataset.slot));
        shortcuts = order.map(slot => Object.prototype.hasOwnProperty.call(previous, slot) ? previous[slot] : null);
        if (shortcuts.length < shortcutCount) shortcuts.length = shortcutCount;
        activeDrag = null;
        saveData();
        [...shortcutsContainer.children].forEach((el, index) => {
          el.dataset.slot = String(index);
          el.classList.remove('is-dragging');
        });
        window.setTimeout(() => { suppressDialClick = false; }, 160);
      };

      document.addEventListener('pointermove', move, { passive: false });
      document.addEventListener('pointerup', finish);
      document.addEventListener('pointercancel', finish);
    });
  }

  // ===== Event Listeners =====

  // Personalização
  // Settings panel toggle
  customizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = controlsPanel.classList.toggle('hidden');
    controlsBackdrop.classList.toggle('hidden', isHidden);
    document.body.classList.toggle('settings-open', !isHidden);
    customizeBtn.setAttribute('aria-expanded', String(!isHidden));
    if (!isHidden) scheduleMaterialSliderProgressUpdate();
  });

  function closeSettings() {
    controlsPanel.classList.add('hidden');
    controlsBackdrop.classList.add('hidden');
    document.body.classList.remove('settings-open');
    customizeBtn.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', (e) => {
    closeMenus();
    if (!controlsPanel.contains(e.target) && e.target !== customizeBtn && !customizeBtn.contains(e.target)) {
      closeSettings();
    }
  });

  controlsPanel.addEventListener('click', (e) => e.stopPropagation());
  controlsBackdrop.addEventListener('click', closeSettings);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { controlsPanel.classList.add('hidden'); controlsBackdrop.classList.add('hidden'); document.body.classList.remove('settings-open'); customizeBtn.setAttribute('aria-expanded', 'false'); } });

  // Importar os favoritos de uma pasta do navegador para os dials.
  const bookmarkFolderSelect = document.getElementById('bookmark-folder-select');

  // This option is created dynamically by the bookmarks API, so it is not
  // reliably covered by the normal static-HTML translation pass. Keep an
  // explicit, language-keyed label and reapply it after locale switching.
  const bookmarkFolderPlaceholderLabels = {
    en: 'Select folder…',
    pt: 'Selecionar pasta…',
    es: 'Seleccionar carpeta…',
    fr: 'Sélectionner un dossier…',
    de: 'Ordner auswählen…'
  };
  const bookmarkFolderErrorLabels = {
    en: 'Could not load bookmark folders',
    pt: 'Não foi possível carregar as pastas de favoritos',
    es: 'No se pudieron cargar las carpetas de marcadores',
    fr: 'Impossible de charger les dossiers de favoris',
    de: 'Lesezeichenordner konnten nicht geladen werden'
  };
  function getBookmarkFolderLabel(labels) {
    const language = window.PrivateSpeedDialI18n?.language || document.getElementById('language-select')?.value || 'en';
    return labels[language] || labels.en;
  }
  function updateBookmarkFolderPlaceholder() {
    if (!bookmarkFolderSelect) return;
    const placeholder = bookmarkFolderSelect.querySelector('option[value=""]');
    if (!placeholder) return;
    const language = window.PrivateSpeedDialI18n?.language || document.getElementById('language-select')?.value || 'en';
    placeholder.textContent = bookmarkFolderPlaceholderLabels[language] || bookmarkFolderPlaceholderLabels.en;
  }
  document.getElementById('language-select')?.addEventListener('change', () => {
    // locales.js also listens for change; apply after its synchronous and next-frame passes.
    queueMicrotask(updateBookmarkFolderPlaceholder);
    requestAnimationFrame(updateBookmarkFolderPlaceholder);
    setTimeout(updateBookmarkFolderPlaceholder, 0);
  });
  function populateBookmarkFolders() {
    if (!bookmarkFolderSelect || !chrome.bookmarks?.getTree) return;
    chrome.bookmarks.getTree((tree) => {
      if (chrome.runtime.lastError) {
        bookmarkFolderSelect.innerHTML = '';
        const errorOption = document.createElement('option');
        errorOption.value = '';
        errorOption.textContent = getBookmarkFolderLabel(bookmarkFolderErrorLabels);
        bookmarkFolderSelect.appendChild(errorOption);
        return;
      }
      bookmarkFolderSelect.innerHTML = '';
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = getBookmarkFolderLabel(bookmarkFolderPlaceholderLabels);
      bookmarkFolderSelect.appendChild(placeholderOption);
      const walk = (nodes, depth = 0) => {
        for (const node of nodes || []) {
          if (Array.isArray(node.children)) {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = `${'　'.repeat(depth)}${node.title || 'Unnamed folder'}`;
            bookmarkFolderSelect.appendChild(option);
            walk(node.children, depth + 1);
          }
        }
      };
      walk(tree);
      updateBookmarkFolderPlaceholder();
    });
  }

  populateBookmarkFolders();
  const importSelectedBookmarkFolder = () => {
    const folderId = bookmarkFolderSelect?.value;
    if (!folderId) {
      return;
    }
    chrome.bookmarks.getSubTree(folderId, (nodes) => {
      if (chrome.runtime.lastError || !nodes?.[0]) {
        window.alert('Could not read the selected bookmark folder.');
        return;
      }
      const imported = (nodes[0].children || [])
        .filter(item => typeof item.url === 'string' && /^https?:\/\//i.test(item.url))
        .map(item => ({ title: item.title || item.url, url: item.url }));
      if (!imported.length) {
        window.alert('This folder contains no web bookmarks directly inside it.');
        return;
      }
      shortcuts = imported.slice(0, 100);
      const columns = Math.max(1, Math.min(10, Number(dialColumns?.value) || 5));
      dialRowsCount = Math.max(1, Math.min(10, Number(dialRows?.value) || 2));
      shortcutCount = columns * dialRowsCount;
      if (shortcuts.length < shortcutCount) shortcuts.length = shortcutCount;
      saveData();
      render();
      window.alert(`Imported ${Math.min(imported.length, 100)} dial(s).`);
    });
  };
  bookmarkFolderSelect?.addEventListener('change', importSelectedBookmarkFolder);

  // Exportar uma cópia integral: valores guardados, layout, atalhos e recursos locais.
  // Three horizontal sliders snap to the labelled centre point (Middle).
  [clockHorizontal, buttonHorizontal].forEach((input) => input?.addEventListener('input', () => {
    const min = Number(input.min || -1920);
    const max = Number(input.max || 1920);
    const threshold = Math.max(20, (max - min) * 14 / Math.max(120, input.clientWidth));
    let value = Number(input.value) || 0;
    if (Math.abs(value) <= threshold) { value = 0; input.value = '0'; }
    if (input.id === 'clock-horizontal') { if (clockWidget) clockWidget.style.setProperty('transform', `translate(${value}px, ${Number(clockVertical?.value) || 0}px)`, 'important'); }
    else customizeBtn.style.setProperty('--button-horizontal-offset', `${value}px`);
    saveClockPreferences();
  }));

  const exportSettingsBtn = document.getElementById('export-settings-btn');
  exportSettingsBtn?.addEventListener('click', () => {
    // Captura também os valores que estejam atualmente nos controlos, mesmo que o
    // utilizador exporte imediatamente após os alterar.
    saveClockPreferences();
    safeSyncSet({ shortcutCount, shortcuts }, (writeError) => {
      if (writeError) {
        console.error('Não foi possível guardar as definições antes da exportação:', chrome.runtime.lastError.message);
        return;
      }
      chrome.storage.local.get(null, (syncSettings) => {
        if (chrome.runtime.lastError) {
          console.error('Não foi possível ler as definições sincronizadas:', chrome.runtime.lastError.message);
          return;
        }
        chrome.storage.local.get(null, (localSettings) => {
          if (chrome.runtime.lastError) {
            console.error('Não foi possível ler as definições locais:', chrome.runtime.lastError.message);
            return;
          }
          const exportedWeatherCity = String(weatherCitySetting?.value || localSettings.weatherCity || 'London, England, United Kingdom').trim() || 'London, England, United Kingdom';
          const removeBackupEnvelope = (source) => {
            const copy = { ...(source || {}) };
            ['content', 'format', 'schemaVersion', 'exportedAt', 'extensionVersion', 'language', 'searchbarEngine'].forEach((key) => delete copy[key]);
            return copy;
          };
          const cleanSyncSettings = removeBackupEnvelope(syncSettings);
          const cleanLocalSettings = removeBackupEnvelope(localSettings);
          const weatherSettings = {
            weatherCity: exportedWeatherCity,
            weatherCityLabel: exportedWeatherCity,
            weatherUnit: weatherUnitSetting?.value === 'imperial' ? 'imperial' : 'metric',
            weatherIntervalMinutes: Math.max(5, Math.min(720, Number(weatherIntervalSetting?.value || localSettings.weatherIntervalMinutes) || 30))
          };
          const exportLocalSettings = { ...cleanLocalSettings, ...weatherSettings };
          const allSettings = { ...cleanSyncSettings, ...exportLocalSettings, ...weatherSettings, privateSpeedDialLanguage: cleanLocalSettings.privateSpeedDialLanguage || cleanSyncSettings.privateSpeedDialLanguage || 'en' };
          const backup = {
            format: 'private-speed-dial-settings',
            schemaVersion: 3,
            extensionVersion: chrome.runtime.getManifest().version,
            exportedAt: new Date().toISOString(),
            language: allSettings.privateSpeedDialLanguage || 'en',
            content: {
              settings: allSettings,
              syncedSettings: cleanSyncSettings,
              localSettings: exportLocalSettings,
              layout: {
                shortcutCount,
                columns: allSettings.dialColumns ?? '5',
                rows: allSettings.dialRows ?? '2',
                gridHeight: allSettings.dialGridHeight ?? 400,
                clock: {
                  fontFamily: allSettings.clockFontFamily ?? 'system',
                  fontSize: allSettings.clockFontSize ?? 82,
                  fontWeight: allSettings.clockFontWeight ?? 300,
                  color: allSettings.clockColor ?? '#1d1d1f',
                  verticalPosition: allSettings.clockVertical ?? 0,
                  horizontalPosition: allSettings.clockHorizontal ?? 0
                },
                date: {
                  fontFamily: allSettings.dateFontFamily ?? 'system',
                  fontSize: allSettings.dateFontSize ?? 17,
                  fontWeight: allSettings.dateFontWeight ?? 400,
                  color: allSettings.dateColor ?? '#68686d',
                  verticalPosition: allSettings.dateVertical ?? 0,
                  horizontalPosition: allSettings.dateHorizontal ?? 0
                },
                customizeButton: {
                  fontFamily: allSettings.buttonFontFamily ?? 'system',
                  fontSize: allSettings.buttonFontSize ?? 13,
                  color: allSettings.buttonFontColor ?? '#1d1d1f',
                  verticalPosition: allSettings.buttonVertical ?? 0
                }
              },
              dials: shortcuts.map((dial, index) => ({ position: index, ...dial })),
              background: { theme: 'light' }
            }
          };
          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'private-speed-dial-settings.json';
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
      });
    });
  });

  // Import a complete JSON backup exported by Private Speed Dial.
  const importSettingsBtn = document.getElementById('import-settings-btn');
  const importSettingsFile = document.getElementById('import-settings-file');
  importSettingsBtn?.addEventListener('click', () => importSettingsFile?.click());
  importSettingsFile?.addEventListener('change', () => {
    const file = importSettingsFile.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let backup;
      try {
        backup = JSON.parse(String(reader.result || ''));
      } catch (error) {
        window.alert('O ficheiro não contém JSON válido. Escolhe uma cópia de segurança exportada pelo Private Speed Dial.');
        importSettingsFile.value = '';
        return;
      }

      if (backup && backup.format === 'private-speed-dial-settings' && backup.content && backup.content.settings) {
        backup = { formato: 'speed-dial-backup-completo', idiomaSelecionado: backup.language || 'en', conteudo: {
          definicoes: backup.content.settings,
          definicoesSincronizadas: backup.content.syncedSettings || {},
          definicoesLocais: backup.content.localSettings || {},
          dials: Array.isArray(backup.content.dials) ? backup.content.dials : []
        }};
      }
      if (!backup || !['speed-dial-backup-completo', 'speed-dial-flor-backup-completo'].includes(backup.formato) || !backup.conteudo ||
          !backup.conteudo.definicoes || typeof backup.conteudo.definicoes !== 'object' ||
          Array.isArray(backup.conteudo.definicoes)) {
        window.alert('Este ficheiro não é uma cópia de segurança válida do Private Speed Dial.');
        importSettingsFile.value = '';
        return;
      }

      const content = backup.conteudo;
      const importedSettings = {
        ...(content.definicoesSincronizadas && typeof content.definicoesSincronizadas === 'object' && !Array.isArray(content.definicoesSincronizadas) ? content.definicoesSincronizadas : {}),
        ...(content.definicoesLocais && typeof content.definicoesLocais === 'object' && !Array.isArray(content.definicoesLocais) ? content.definicoesLocais : {}),
        ...content.definicoes
      };
      // Ignore a legacy hard-coded search provider in imported backups.
      delete importedSettings.searchbarEngine;
      if (!importedSettings.privateSpeedDialLanguage && backup.idiomaSelecionado) {
        importedSettings.privateSpeedDialLanguage = ['en', 'pt', 'es', 'fr', 'de'].includes(backup.idiomaSelecionado) ? backup.idiomaSelecionado : 'en';
      }
      // Preserve weather preferences from exported settings. Older exports may not include the unit.
      importedSettings.weatherCity = String(importedSettings.weatherCity || 'London, England, United Kingdom').trim() || 'London, England, United Kingdom';
      importedSettings.weatherCityLabel = importedSettings.weatherCity;
      importedSettings.weatherUnit = importedSettings.weatherUnit === 'imperial' ? 'imperial' : 'metric';
      ['content', 'format', 'schemaVersion', 'exportedAt', 'extensionVersion', 'language'].forEach((key) => delete importedSettings[key]);
      importedSettings.weatherIntervalMinutes = Math.max(5, Math.min(720, Number(importedSettings.weatherIntervalMinutes) || 30));
      if (importedSettings.weatherCache && String(importedSettings.weatherCache.cityQuery || importedSettings.weatherCache.city || '').toLowerCase() !== importedSettings.weatherCity.toLowerCase()) {
        importedSettings.weatherCache = null;
        importedSettings.weatherPlace = null;
      }
      const importedDials = Array.isArray(content.dials)
        ? content.dials.slice(0, 100).map(dial => {
            if (!dial || typeof dial !== 'object' || Array.isArray(dial)) return null;
            const copy = { ...dial };
            if (typeof copy.title === 'string') copy.title = copy.title.slice(0, 60);
            else if (typeof copy.name === 'string') copy.name = copy.name.slice(0, 60);
            delete copy.posicao;
            return copy;
          }).filter(dial => dial && (typeof dial.url === 'string' || typeof dial.title === 'string' || typeof dial.name === 'string'))
        : null;
      if (importedDials) {
        importedSettings.shortcuts = importedDials;
        importedSettings.shortcutCount = Math.max(1, Math.min(100, Number(importedSettings.shortcutCount) || importedDials.length || DEFAULT_COUNT));
        if (importedSettings.shortcuts.length < importedSettings.shortcutCount) {
          importedSettings.shortcuts.length = importedSettings.shortcutCount;
        }
      }

      const confirmed = window.confirm('Importar estas definições irá substituir as definições e os dials atuais. Queres continuar?');
      if (!confirmed) {
        importSettingsFile.value = '';
        return;
      }
      chrome.storage.local.set(importedSettings, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error('Erro ao importar definições:', error.message);
          window.alert('Não foi possível importar as definições. Verifica se o ficheiro é demasiado grande e tenta novamente.');
          importSettingsFile.value = '';
          return;
        }
        window.alert('Definições importadas com sucesso. A página será atualizada para aplicar todas as alterações.');
        window.location.reload();
      });
    };
    reader.onerror = () => {
      window.alert('Não foi possível ler o ficheiro selecionado.');
      importSettingsFile.value = '';
    };
    reader.readAsText(file);
  });

  // A grelha é sempre definida pelo produto colunas x linhas.
  [dialColumns, dialRows].forEach((input) => {
    input?.addEventListener('change', () => {
      const columns = Math.max(1, Math.min(10, Number(dialColumns.value) || 5));
      dialRowsCount = Math.max(1, Math.min(10, Number(dialRows.value) || 2));
      shortcutCount = columns * dialRowsCount;
      if (shortcuts.length < shortcutCount) shortcuts.length = shortcutCount;
      saveData();
      render();
    });
  });

  // Modal handlers
  // Enter em qualquer campo do popup aplica imediatamente as alterações.
  [modalName, modalUrl].forEach((field) => {
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        modalDone.click();
      }
    });
  });

  modalCancel.addEventListener('click', closeEditModal);

  modalDone.addEventListener('click', () => {
    if (editingIndex === null) return;

    const url = normalizeUrl(modalUrl.value);
    const name = ((modalName.value || '').trim() || titleFromUrl(url)).slice(0, 60);

    if (!url) {
      closeEditModal();
      return;
    }

    // Preservar propriedades adicionais do dial (ex.: logoUrl) ao editar nome/URL.
    shortcuts[editingIndex] = { ...(shortcuts[editingIndex] || {}), title: name, url };
    saveData();
    render();
    closeEditModal();
  });

  editModal.addEventListener('mousedown', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  // Focus trap for edit modal
  editModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeEditModal();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = editModal.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ===== Initialize =====
  // Aplicar as preferências exportadas apenas numa instalação realmente nova.
  // Em atualizações, nunca substituir as definições já existentes do utilizador.
  async function initializeDefaultsThenStart() {
    chrome.storage.local.get(null, async (stored) => {
      if (chrome.runtime.lastError) {
        console.warn('Não foi possível verificar as definições guardadas:', chrome.runtime.lastError.message);
        startClock();
        loadTheme();
        loadData();
        return;
      }
      // Remove the retired hard-coded provider preference from existing installs.
      if (stored && Object.prototype.hasOwnProperty.call(stored, 'searchbarEngine')) {
        delete stored.searchbarEngine;
        chrome.storage.local.remove('searchbarEngine');
      }

      const hasUserData = Object.keys(stored || {}).some((key) => !['__speedDialDefaultsApplied', 'privateSpeedDialLanguage'].includes(key));
      if (!hasUserData && !stored.__speedDialDefaultsApplied) {
        try {
          const response = await fetch(chrome.runtime.getURL('defaults.json'));
          if (!response.ok) throw new Error('Não foi possível carregar as definições predefinidas.');
          const defaults = await response.json();
          await new Promise((resolve, reject) => {
            chrome.storage.local.set({ ...defaults, __speedDialDefaultsApplied: true }, () => {
              const error = chrome.runtime.lastError;
              if (error) reject(new Error(error.message));
              else resolve();
            });
          });
        } catch (error) {
          console.error('Não foi possível aplicar as definições iniciais:', error);
        }
      } else if (!stored.__speedDialDefaultsApplied) {
        // A extensão já tinha dados antes desta versão: não os substituir.
        chrome.storage.local.set({ __speedDialDefaultsApplied: true });
      }

      // Re-apply stored search-bar settings after first-run defaults have been written.
      chrome.storage.local.get(Object.keys(searchbarDefaults), applySearchbar);
      startClock();
      loadTheme();
      loadData();
    });
  }
  initializeDefaultsThenStart();
  // Viewport-aware clock/date presets. The widget is positioned as a single measured unit.
  function applyViewportPositionPreset(group, position) {
    const configs = {
      'clock-horizontal': { element: clockWidget, horizontal: clockHorizontal, vertical: clockVertical },
      'button-horizontal': { element: customizeBtn, horizontal: buttonHorizontal, vertical: buttonVertical }
    };
    const cfg = configs[group];
    if (!cfg?.element || !cfg.horizontal || !cfg.vertical) return;
    const el = cfg.element;
    const rect = el.getBoundingClientRect();
    const currentX = Number(cfg.horizontal.value) || 0;
    const currentY = Number(cfg.vertical.value) || 0;
    const baseLeft = rect.left - currentX;
    const baseTop = rect.top - currentY;
    const pad = 16;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const w = rect.width, h = rect.height;
    const horizontal = position.endsWith('left') ? 'left' : position.endsWith('right') ? 'right' : 'middle';
    const vertical = position.startsWith('top') ? 'top' : 'bottom';
    let x = horizontal === 'left' ? pad : horizontal === 'right' ? vw - w - pad : (vw - w) / 2;
    let y = vertical === 'top' ? pad : vh - h - pad;
    x = Math.max(pad, Math.min(Math.max(pad, vw - w - pad), x));
    y = Math.max(pad, Math.min(Math.max(pad, vh - h - pad), y));

    if (group === 'clock-horizontal' && clockWidget) {
      // Align both text lines to the chosen edge; centered presets share the clock's center.
      clockWidget.style.width = 'max-content';
      clockWidget.style.alignItems = horizontal === 'left' ? 'flex-start' : horizontal === 'right' ? 'flex-end' : 'center';
      clockWidget.style.textAlign = horizontal === 'left' ? 'left' : horizontal === 'right' ? 'right' : 'center';
      if (clockTime) { clockTime.style.textAlign = clockWidget.style.textAlign; }
      if (clockDate) { clockDate.style.textAlign = clockWidget.style.textAlign; }
      // Re-measure after changing alignment/width so the target uses the actual current viewport geometry.
      const updated = el.getBoundingClientRect();
      const newW = updated.width, newH = updated.height;
      x = horizontal === 'left' ? pad : horizontal === 'right' ? vw - newW - pad : (vw - newW) / 2;
      y = vertical === 'top' ? pad : vh - newH - pad;
      x = Math.max(pad, Math.min(Math.max(pad, vw - newW - pad), x));
      y = Math.max(pad, Math.min(Math.max(pad, vh - newH - pad), y));
    }
    const nextX = Math.round(x - baseLeft);
    const nextY = Math.round(y - baseTop);
    cfg.horizontal.value = String(Math.max(Number(cfg.horizontal.min), Math.min(Number(cfg.horizontal.max), nextX)));
    cfg.vertical.value = String(Math.max(Number(cfg.vertical.min), Math.min(Number(cfg.vertical.max), nextY)));
    cfg.horizontal.dispatchEvent(new Event('input', { bubbles: true }));
    cfg.vertical.dispatchEvent(new Event('input', { bubbles: true }));
    saveClockPreferences();
  }
  document.querySelectorAll('.position-preset').forEach((presetButton) => {
    presetButton.addEventListener('click', () => applyViewportPositionPreset(presetButton.dataset.positionGroup, presetButton.dataset.position));
  });
  window.addEventListener('resize', () => {
    // Existing saved offsets remain unchanged on resize; presets recalculate from the current viewport when clicked.
  });

});


// Pesquisa instantânea das definições: filtra os controlos à medida que se escreve.
function setupSettingsTabs() {
  const panel = document.getElementById('controls-panel');
  const searchSection = panel?.querySelector('.settings-search-section');
  if (!panel || !searchSection || panel.querySelector('.settings-tabs-layout')) return;

  // Keep Language and bookmark import controls compact, above the entire Search settings section.
  const languageTop = panel.querySelector(':scope > .language-section');
  const bookmarkTop = Array.from(panel.children).find(el => el.matches('.export-row') && el.querySelector('#bookmark-folder-select'));

  const children = Array.from(panel.children);
  const searchIndex = children.indexOf(searchSection);
  const beforeSearch = children.slice(0, searchIndex);
  const afterSearch = children.slice(searchIndex + 1);
  const searchbar = afterSearch.find(el => el.matches('.searchbar-settings'));
  const background = afterSearch.find(el => el.matches('.theme-section'));
  const entry = afterSearch.find(el => el.matches('.animation-duration-settings'));
  // These settings sections must be located using stable, untranslated identifiers.
  // locales.js translates aria-labels and headings; relying on their visible text here
  // caused the grid/appearance sections to be missed when Spanish/French/German loaded
  // before DOMContentLoaded. The data-settings-section attributes are never translated.
  const directChildren = Array.from(panel.children);
  const grid = directChildren.find(el => el.matches('.dial-settings') && (
    el.dataset.settingsSection === 'grid' || el.querySelector('#dial-columns')
  ));
  const appearance = directChildren.find(el => el.matches('.dial-settings') && (
    el.dataset.settingsSection === 'appearance' || el.querySelector('#dial-shape')
  ));
  const clock = afterSearch.find(el => el.matches('.clock-settings'));
  const button = afterSearch.find(el => el.matches('.button-settings'));
  const separators = afterSearch.filter(el => el.matches('.separator-settings'));
  const pro = beforeSearch.find(el => el.matches('.general-utilities-section'));
  // The Extension settings label is authored directly in newtab.html and translated via data-i18n.

  const layout = document.createElement('div'); layout.className = 'settings-tabs-layout';
  const nav = document.createElement('div'); nav.className = 'settings-tabs-nav'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Settings categories');
  const content = document.createElement('div'); content.className = 'settings-tabs-content';
  layout.append(nav, content);
  searchSection.after(layout);
  // Language lives at the bottom of the sidebar, separate from the tab buttons.
  const oldUtilityRow = panel.querySelector(':scope > .top-utility-controls');
  if (oldUtilityRow) oldUtilityRow.remove();
  if (bookmarkTop && pro && !pro.contains(bookmarkTop)) {
    pro.appendChild(bookmarkTop);
    bookmarkTop.classList.add('pro-bookmark-import-row');
  }

  const definitions = [
    {id:'pro', label:'General settings', icon:'⚙️', items:[pro]},
    {id:'searchbar', label:'Search bar', icon:'⌕', items:[searchbar]},
    {id:'background', label:'Page background', icon:'🖼️', items:[background]},
    {id:'grid', label:'Dials grid and appearance', icon:'▦', items:[grid, appearance]},
    {id:'animations', label:'Animations', icon:'✨', items:[entry]},
    
    {id:'clock', label:'Clock & date', icon:'🕒', items:[clock]},
    {id:'button', label:'Settings button', icon:'⚙️', items:[button]},
    {id:'separators', label:'Separators', icon:'━', items:separators}
  ].map(d => ({...d, items:d.items.filter(Boolean)})).filter(d=>d.items.length);

  // Keep general import/export utilities in the General settings tab.

  // Put all settings sections into their tab panels; settings are applied and saved in real time.
  const used = new Set([searchSection, layout, oldUtilityRow, languageTop, bookmarkTop].filter(Boolean));
  definitions.forEach((d, i) => {
    const btn = document.createElement('button'); btn.type='button'; btn.className='settings-tab';
    btn.id=`settings-tab-${d.id}`; btn.setAttribute('role','tab'); btn.setAttribute('aria-controls',`settings-tab-panel-${d.id}`);
    btn.setAttribute('aria-selected', i===0 ? 'true':'false'); btn.tabIndex=i===0?0:-1;
    btn.innerHTML=`<span aria-hidden="true">${d.icon}</span><span class="settings-tab-label" data-i18n="${d.label}">${d.label}</span>`;
    const pane=document.createElement('div'); pane.className='settings-tab-panel'; pane.id=`settings-tab-panel-${d.id}`;
    pane.setAttribute('role','tabpanel'); pane.setAttribute('aria-labelledby',btn.id); pane.hidden=i!==0;
    d.items.forEach(item=>{ pane.appendChild(item); used.add(item); });
    nav.appendChild(btn); content.appendChild(pane);
    btn.addEventListener('click',()=>activate(d.id));
    btn.addEventListener('keydown',e=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
      e.preventDefault(); const buttons=Array.from(nav.querySelectorAll('.settings-tab'));
      let idx=buttons.indexOf(btn); idx=e.key==='Home'?0:e.key==='End'?buttons.length-1:(idx+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
      buttons[idx].focus(); buttons[idx].click();
    });
  });
  if (languageTop) {
    languageTop.classList.add('settings-language-sidebar');
    languageTop.removeAttribute('style');
    nav.appendChild(languageTop);
  }
  // Use a stable, viewport-bounded settings layout. Measuring translated text
  // and changing grid widths on each language mutation caused layout thrashing
  // and could make the nav/content tracks disagree with the drawer width.
  const resizeSettingsForTabLabels = () => {
    const viewportWidth = Math.max(320, document.documentElement.clientWidth || window.innerWidth || 320);
    const drawerWidth = Math.min(600, Math.max(340, viewportWidth - 28));
    const navWidth = Math.min(230, Math.max(160, Math.floor(drawerWidth * 0.27)));
    panel.style.setProperty('--settings-nav-width', `${navWidth}px`);
    panel.style.setProperty('--settings-panel-width', `${drawerWidth}px`);
    panel.style.setProperty('--settings-drawer-inner-width', `${Math.max(280, drawerWidth - 28)}px`);
  };
  resizeSettingsForTabLabels();
  if (!nav.dataset.dynamicWidthObserver) {
    nav.dataset.dynamicWidthObserver = 'true';
    document.getElementById('language-select')?.addEventListener('change', () => {
      requestAnimationFrame(resizeSettingsForTabLabels);
    });
    window.addEventListener('resize', resizeSettingsForTabLabels);
  }
  function activate(id){
    nav.querySelectorAll('.settings-tab').forEach(b=>{const active=b.id===`settings-tab-${id}`;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    content.querySelectorAll('.settings-tab-panel').forEach(p=>p.hidden=p.id!==`settings-tab-panel-${id}`);
  }
  // Keep any remaining legacy settings in the combined Dial grid and dials tab,
  // rather than creating a second, duplicate Dial appearance tab at the end.
  const leftovers=Array.from(panel.children).filter(el=>!used.has(el) && el!==searchSection && el!==layout && !el.matches('.controls-divider'));
  const combinedPane = content.querySelector('#settings-tab-panel-grid');
  if (combinedPane) {
    leftovers.forEach(el=>{ combinedPane.appendChild(el); used.add(el); });
    // Enforce subsection order even if the source DOM had been rearranged.
    if (grid && appearance) {
      combinedPane.insertBefore(grid, combinedPane.firstChild);
      grid.after(appearance);
    }
  }
  // Remove obsolete separators that were only needed in the former long scrolling list.
  panel.querySelectorAll(':scope > .controls-divider').forEach(el=>el.remove());
}

// Instant settings search: keep the search box visible above the vertical tabs and show matching controls.
function setupSettingsSearch() {
  const input = document.getElementById('settings-search-input');
  const count = document.getElementById('settings-search-count');
  const panel = document.getElementById('controls-panel');
  if (!input || !count || !panel) return;
  setupSettingsTabs();
  const nav = panel.querySelector('.settings-tabs-nav');
  const panes = Array.from(panel.querySelectorAll('.settings-tab-panel'));
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').trim();

  function applySearch(){
    const query=normalize(input.value); let total=0; let firstMatch=null;
    panes.forEach(pane=>{
      let paneMatches=0;
      const items=Array.from(pane.children);
      items.forEach(section=>{
        if(!query){ section.hidden=false; section.querySelectorAll('.font-setting,.color-choice,.background-options,.settings-search-empty').forEach(el=>el.hidden=false); return; }
        const heading=section.querySelector('.settings-heading');
        const whole=normalize((heading?.textContent||section.getAttribute('aria-label')||section.textContent)).includes(query);
        let n=whole?1:0;
        section.querySelectorAll('.font-setting').forEach(row=>{const label=row.querySelector('label:not(.visibility-option)');const match=whole||normalize(label?.textContent||row.textContent).includes(query);row.hidden=!match;if(match)n++;});
        section.querySelectorAll('.color-choice').forEach(row=>{const match=whole||normalize(row.textContent).includes(query);row.hidden=!match;if(match)n++;});
        section.querySelectorAll('.background-options').forEach(row=>{const match=whole||normalize(row.textContent).includes(query);row.hidden=!match;if(match)n++;});
        section.hidden=n===0; paneMatches+=n;
      });
      pane.dataset.matches=String(paneMatches); total+=paneMatches;
      const tab=nav?.querySelector(`[aria-controls="${pane.id}"]`);
      if(tab) tab.hidden=!!query&&paneMatches===0;
      if(query&&paneMatches>0&&!firstMatch) firstMatch=pane.id.replace('settings-tab-panel-','');
    });
    if(query){
      if(firstMatch){
        nav?.querySelectorAll('.settings-tab').forEach(b=>{const active=b.id===`settings-tab-${firstMatch}`;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
        panes.forEach(p=>p.hidden=p.id!==`settings-tab-panel-${firstMatch}`);
      } else panes.forEach(p=>p.hidden=true);
      count.textContent=total===0?'No settings found':`${total} ${total===1?'result':'results'}`;
    } else {
      nav?.querySelectorAll('.settings-tab').forEach(b=>b.hidden=false);
      const selected=nav?.querySelector('.settings-tab[aria-selected="true"]')||nav?.querySelector('.settings-tab');
      const activeId=selected?.id.replace('settings-tab-','');
      panes.forEach(p=>p.hidden=p.id!==`settings-tab-panel-${activeId}`);
      count.textContent='All settings';
    }
  }
  input.addEventListener('input',applySearch); input.addEventListener('search',applySearch);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSettingsSearch, { once: true });
} else {
  setupSettingsSearch();
}

// Preset cards are selectable placeholders; applying saved layouts will be added later.
document.querySelectorAll('.preset-card[data-preset]').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.preset-card[data-preset]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === card));
    });
  });
});
