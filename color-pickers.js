// Mantém o preenchimento visual dos seletores sincronizado com o valor real,
// incluindo alterações feitas pelo carregamento das preferências ao reabrir o menu.
(() => {
  const syncColorPicker = (input) => {
    const wrapper = input?.parentElement?.classList.contains('color-picker-square')
      ? input.parentElement
      : null;
    if (!wrapper) return;
    const color = /^#[0-9a-f]{6}$/i.test(input.value) ? input.value : '#ffffff';
    wrapper.style.backgroundColor = color;
    wrapper.style.setProperty('--selected-color', color);
  };

  const syncAll = () => {
    document.querySelectorAll('#controls-panel input[type="color"]').forEach(syncColorPicker);
  };
  // Permite ao código de definições atualizar as amostras quando altera valores
  // programaticamente (por exemplo, ao alternar entre tema claro e escuro).
  window.syncColorPickerSwatches = syncAll;

  const install = () => {
    document.querySelectorAll('#controls-panel input[type="color"]').forEach((input) => {
      if (!input.parentElement?.classList.contains('color-picker-square')) {
        const wrapper = document.createElement('span');
        wrapper.className = 'color-picker-square';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }
      syncColorPicker(input);
      input.addEventListener('input', () => syncColorPicker(input));
      input.addEventListener('change', () => syncColorPicker(input));
    });

    // O código de preferências atribui valores aos inputs programaticamente.
    // Ao abrir o painel, sincroniza as amostras com esses valores persistidos.
    document.getElementById('customize-btn')?.addEventListener('click', () => {
      requestAnimationFrame(syncAll);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) syncAll();
    });
    syncAll();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
