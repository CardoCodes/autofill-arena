interface FillableElement {
  tag: string;
  type?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string | null;
  labelText?: string | null;
  // Consider adding a unique selector (e.g., CSS path) for later targeting
}

function getLabelText(element: HTMLElement): string | null {
  // 1. Use element.labels NodeList
  if (element.labels && element.labels.length > 0) {
    return Array.from(element.labels).map(label => label.textContent).join(' ').trim();
  }

  // 2. Try to find label by "for" attribute
  if (element.id) {
    const labelFor = document.querySelector(`label[for="\${element.id}"]`);
    if (labelFor) return labelFor.textContent?.trim() || null;
  }

  // 3. Try to find by wrapping label (closest ancestor)
  const parentLabel = element.closest('label');
  if (parentLabel) return parentLabel.textContent?.trim() || null;

  // 4. Try aria-labelledby
  const labelledby = element.getAttribute('aria-labelledby');
  if (labelledby) {
    const labelElement = document.getElementById(labelledby);
    if (labelElement) return labelElement.textContent?.trim() || null;
  }
  
  // 5. Try aria-label directly on the element
  const ariaLabelAttr = element.getAttribute('aria-label');
  if (ariaLabelAttr) return ariaLabelAttr.trim();
  
  return null;
}

function scanPageForFillableElements(): FillableElement[] {
  const elements: FillableElement[] = [];
  const selectors = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), textarea, select';
  
  document.querySelectorAll(selectors).forEach((el) => {
    const element = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const tagName = element.tagName.toLowerCase();
    let type: string | undefined;

    if (element instanceof HTMLInputElement) {
      type = element.type;
    } else if (element instanceof HTMLSelectElement) {
      type = element.multiple ? 'select-multiple' : 'select-one';
    } else if (element instanceof HTMLTextAreaElement) {
      type = 'textarea';
    }

    elements.push({
      tag: tagName,
      type: type,
      id: element.id || undefined,
      name: element.name || undefined,
      placeholder: (element as HTMLInputElement | HTMLTextAreaElement).placeholder || undefined,
      ariaLabel: element.getAttribute('aria-label'),
      labelText: getLabelText(element),
    });
  });
  console.log('Content script scanned elements:', elements);
  return elements;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  if (request.action === "SCAN_PAGE_CONTENT") {
    try {
      const scannedElements = scanPageForFillableElements();
      sendResponse({ status: "success", data: scannedElements });
    } catch (error) {
      console.error("Error scanning page in content script:", error);
      sendResponse({ status: "error", message: error instanceof Error ? error.message : "Unknown error during scan" });
    }
    return true; // Indicates that the response is sent asynchronously.
  } else if (request.action === "GET_PAGE_COMPATIBILITY_CONTENT") {
    try {
      const forms = document.querySelectorAll('form');
      const inputFields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
      const isLikelyApplicationPage = 
        document.title.toLowerCase().includes("apply") ||
        document.title.toLowerCase().includes("application") ||
        document.title.toLowerCase().includes("career") ||
        window.location.href.toLowerCase().includes("apply") ||
        window.location.href.toLowerCase().includes("career") ||
        window.location.href.toLowerCase().includes("jobs");

      let compatibilityStatus: "ready" | "not-available" | "in-progress" = "not-available";
      let message = "This page doesn't appear to be a job application form.";

      if (forms.length > 0 && inputFields.length > 2) {
          compatibilityStatus = "ready";
          message = "This page looks like it can be autofilled!";
      } else if (isLikelyApplicationPage && inputFields.length > 0) {
          compatibilityStatus = "in-progress"; // Or "ready" with a cautious message
          message = "This page might be an application. Some fields may be fillable.";
      } else if (isLikelyApplicationPage) {
          compatibilityStatus = "not-available"; // Or a specific status indicating uncertainty
          message = "Page title or URL suggests an application, but no clear forms found.";
      }
      
      sendResponse({ 
        status: "success", 
        data: { 
          compatibilityStatus: compatibilityStatus, 
          message: message, 
          url: window.location.href 
        } 
      });
    } catch (error) {
      console.error("Error checking page compatibility in content script:", error);
      sendResponse({ status: "error", message: error instanceof Error ? error.message : "Unknown error during compatibility check" });
    }
    return true; // Asynchronous response
  }
  return false; // Default for unhandled messages
});

console.log("Autofill content script loaded and listening."); 