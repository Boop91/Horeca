let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function getScrollbarCompensation() {
  if (typeof window === 'undefined') return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;

  lockCount += 1;
  if (lockCount > 1) return;

  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  const scrollbarCompensation = getScrollbarCompensation();
  const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight || '0') || 0;

  body.style.overflow = 'hidden';
  if (scrollbarCompensation > 0) {
    body.style.paddingRight = `${computedPaddingRight + scrollbarCompensation}px`;
  }
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
}

