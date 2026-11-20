// A one-line status message at the bottom of the window, for export, import
// and reset confirmations.

let hideTimer = null;

export function showToast(message, ms = 3200) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => {
      toast.hidden = true;
    }, 220);
  }, ms);
}
