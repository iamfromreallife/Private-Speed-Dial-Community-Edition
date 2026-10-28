/* Synchronous first-paint background bootstrap.
 * This script runs in <head> before newtab.css. Set the exact variables consumed
 * by #page-background-layer as well as the root canvas, otherwise the stylesheet's
 * default --bg-color can paint over the early root background until newtab.js runs.
 */
(() => {
  let dark = false;
  let mode = 'default-color';
  let image = '';
  let savedColor = '';
  try {
    dark = false;
    mode = 'default-color';
    savedColor = '';
    image = '';
  } catch (_) {}

  const root = document.documentElement;
  const fallback = dark ? '#1c1e22' : '#ffffff';
  // For image mode, keep a cached image-derived colour underneath the image.
  // CSS background images decode asynchronously; a transparent layer exposes the
  // browser's white canvas until decoding completes.
  const color = (mode === 'solid-color' || mode === 'custom-image') && /^#[0-9a-f]{6}$/i.test(savedColor)
    ? savedColor
    : fallback;
  const validImage = mode === 'custom-image' && image.startsWith('data:image/');
  const cssImage = validImage ? `url("${image}")` : 'none';

  // These are the values actually read by newtab.css on its first style/layout.
  root.style.setProperty('--bg-color', color);
  root.style.setProperty('--bg-image', cssImage);
  root.style.backgroundColor = color;
  root.style.backgroundImage = cssImage;
  root.style.backgroundSize = 'cover';
  root.style.backgroundPosition = 'center center';
  root.style.backgroundRepeat = 'no-repeat';
  root.style.colorScheme = dark ? 'dark' : 'light';
  root.classList.add(dark ? 'psd-startup-dark' : 'psd-startup-light');
})();
