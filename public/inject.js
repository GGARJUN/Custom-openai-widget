(function () {
  // Prevent multiple executions
  if (window.__widgetIframeInjected) return;
  window.__widgetIframeInjected = true;

  try {
    // Safely access script tag and dataset
    const scriptTag = document.currentScript || (function () {
      const scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1]; // Fallback to last script
    })();
    
    const projectId = (scriptTag?.dataset?.projectId || "default").trim();
    const tags = (scriptTag?.dataset?.tags || "")
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    // Validate inputs to prevent XSS
    const isValidId = /^[a-zA-Z0-9_-]+$/.test(projectId);
    if (!isValidId) {
      console.error("Invalid projectId:", projectId);
      return;
    }

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = `https://gregarious-malasada-46a300.netlify.app/?project_id=${encodeURIComponent(projectId)}&tags=${encodeURIComponent(tags.join(","))}`;
    iframe.title = "Chat Widget";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "430px";
    iframe.style.height = "480px";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.borderRadius = "12px";
    iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    iframe.allowTransparency = true;
    iframe.allow = "clipboard-write; encrypted-media";

    // Ensure document.body exists before appending
    if (document.body) {
      document.body.appendChild(iframe);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(iframe);
      });
    }

    // Optional: Add removal function for cleanup
    window.__removeWidgetIframe = () => {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      window.__widgetIframeInjected = false;
    };
  } catch (error) {
    console.error("Failed to inject widget iframe:", error);
  }
})();