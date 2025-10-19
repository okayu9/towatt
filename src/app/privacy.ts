import { trackPrivacyModal } from "./analytics";
import type { AppElements } from "./dom";

export function initializePrivacyPolicy(elements: AppElements): void {
  const {
    privacyOpenButton,
    privacyModal,
    privacyModalPanel,
    privacyDismissButtons,
  } = elements;

  let lastFocusedElement: HTMLElement | null = null;

  function openModal(): void {
    if (!privacyModal.hidden) {
      return;
    }
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    privacyModal.hidden = false;
    privacyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("privacy-modal-open");
    trackPrivacyModal("open");
    window.addEventListener("keydown", handleKeydown);
    privacyModal.addEventListener("keydown", handleFocusTrap);
    window.setTimeout(() => {
      privacyModalPanel.focus();
    }, 0);
  }

  function closeModal(reason = "dismiss"): void {
    if (privacyModal.hidden) {
      return;
    }
    privacyModal.hidden = true;
    privacyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("privacy-modal-open");
    window.removeEventListener("keydown", handleKeydown);
    privacyModal.removeEventListener("keydown", handleFocusTrap);
    trackPrivacyModal("close", reason);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal("escape");
    }
  }

  function getFocusableElements(): HTMLElement[] {
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(
      privacyModalPanel.querySelectorAll<HTMLElement>(selector),
    ).filter((element) => !element.hasAttribute("hidden") && element.tabIndex !== -1);
  }

  function handleFocusTrap(event: KeyboardEvent): void {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      privacyModalPanel.focus();
      return;
    }

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (!event.shiftKey) {
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
      return;
    }

    if (activeElement === firstElement || !activeElement || !privacyModal.contains(activeElement)) {
      event.preventDefault();
      lastElement.focus();
    }
  }

  privacyOpenButton.addEventListener("click", () => {
    openModal();
  });

  privacyDismissButtons.forEach((element) => {
    element.addEventListener("click", () => {
      const reason = element.dataset.privacyDismiss ?? "dismiss";
      closeModal(reason);
    });
  });

  privacyModalPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
