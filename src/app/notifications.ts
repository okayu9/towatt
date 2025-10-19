export function createBannerNotifier(element: HTMLElement, durationMs: number) {
  let timer: number | null = null;

  function hide(): void {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    element.hidden = true;
  }

  function show(message: string): void {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
    element.textContent = message;
    element.hidden = false;
    timer = window.setTimeout(() => {
      timer = null;
      element.hidden = true;
    }, durationMs);
  }

  return {
    show,
    hide,
  };
}
