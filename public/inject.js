// (function () {
//   // Prevent multiple executions
//   if (window.__widgetIframeInjected) {
//     console.log("Widget iframe already injected, skipping.");
//     return;
//   }
//   window.__widgetIframeInjected = true;

//   try {
//     // Safely access script tag and dataset
//     const scriptTag = document.currentScript || (function () {
//       const scripts = document.getElementsByTagName("script");
//       return scripts[scripts.length - 1]; // Fallback to last script
//     })();

//     const projectId = (scriptTag?.dataset?.projectId || "default").trim();
//     const tags = (scriptTag?.dataset?.tags || "")
//       .split(",")
//       .map(tag => tag.trim())
//       .filter(Boolean);

//     // Validate inputs to prevent XSS
//     const isValidId = /^[a-zA-Z0-9_-]+$/.test(projectId);
//     if (!isValidId) {
//       console.error("Invalid projectId:", projectId);
//       return;
//     }

//     // Get idToken from localStorage (set by Login component)
//     const idToken = localStorage.getItem("idToken") || "";

//     // Create iframe
//     const iframe = document.createElement("iframe");
//     iframe.src = `https://custom-chatbot-widget.netlify.app/?project_id=${encodeURIComponent(projectId)}&tags=${encodeURIComponent(tags.join(","))}&idToken=${encodeURIComponent(idToken)}&apiBaseUrl=${encodeURIComponent("https://u9pvrypbbl.execute-api.us-east-1.amazonaws.com/prod/")}`;
//     iframe.title = "Chat Widget";
//     iframe.style.position = "fixed";
//     iframe.style.bottom = "20px";
//     iframe.style.right = "20px";
//     iframe.style.width = "430px";
//     iframe.style.height = "480px";
//     iframe.style.border = "none";
//     iframe.style.zIndex = "999999";
//     iframe.style.borderRadius = "12px";
//     iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
//     iframe.allowTransparency = true;
//     iframe.allow = "clipboard-write; encrypted-media";

//     // Log iframe URL for debugging
//     console.log("Iframe URL:", iframe.src);

//     // Ensure document.body exists before appending
//     if (document.body) {
//       document.body.appendChild(iframe);
//     } else {
//       document.addEventListener("DOMContentLoaded", () => {
//         document.body.appendChild(iframe);
//       });
//     }

//     // Handle messages from iframe
//     window.addEventListener("message", (event) => {
//       if (event.origin !== "https://custom-chatbot-widget.netlify.app") {
//         console.warn("Ignored message from unauthorized origin:", event.origin);
//         return;
//       }

//       console.log("Received message from iframe:", event.data);

//       if (event.data.type === "loginRequired") {
//         // Redirect to login page (matches BubbleBtn and Header)
//         console.log("Iframe requested login, redirecting to /auth/pages/login");
//         window.location.href = "/auth/pages/login";
//       } else if (event.data.type === "requestIdToken") {
//         // Send updated idToken to iframe
//         const currentIdToken = localStorage.getItem("idToken") || "";
//         console.log("Sending idToken to iframe:", currentIdToken);
//         iframe.contentWindow?.postMessage(
//           { type: "idToken", idToken: currentIdToken },
//           "https://custom-chatbot-widget.netlify.app"
//         );
//       } else if (event.data.type === "toast") {
//         // Trigger toast in parent page (matches RootLayout Toaster)
//         if (window.sonner) {
//           console.log("Triggering toast:", event.data.severity, event.data.message);
//           window.sonner[event.data.severity](event.data.message);
//         } else {
//           console.warn("Sonner toast library not available");
//         }
//       } else if (event.data.type === "authError") {
//         // Log authentication errors from iframe
//         console.error("Iframe authentication error:", event.data.message);
//         if (window.sonner) {
//           window.sonner.error(event.data.message || "Unable to authenticate in widget. Please try again.");
//         }
//       }
//     });

//     // Update iframe src with new idToken when it changes
//     const updateIframeAuth = () => {
//       const currentIdToken = localStorage.getItem("idToken") || "";
//       iframe.src = `https://custom-chatbot-widget.netlify.app/?project_id=${encodeURIComponent(projectId)}&tags=${encodeURIComponent(tags.join(","))}&idToken=${encodeURIComponent(currentIdToken)}&apiBaseUrl=${encodeURIComponent("https://u9pvrypbbl.execute-api.us-east-1.amazonaws.com/prod/")}`;
//       console.log("Updated iframe URL:", iframe.src);
//     };

//     // Watch for changes in localStorage (e.g., after login/logout)
//     window.addEventListener("storage", (event) => {
//       if (event.key === "idToken") {
//         console.log("idToken changed:", event.newValue);
//         updateIframeAuth();
//       }
//     });

//     // Optional: Add removal function for cleanup
//     window.__removeWidgetIframe = () => {
//       if (iframe && iframe.parentNode) {
//         iframe.parentNode.removeChild(iframe);
//         console.log("Iframe removed");
//       }
//       window.__widgetIframeInjected = false;
//     };
//   } catch (error) {
//     console.error("Failed to inject widget iframe:", error);
//   }
// })();


(function () {
  const scriptTag = document.currentScript;
  const projectId = scriptTag?.dataset.projectId || "project1";
  const tags = (scriptTag?.dataset.tags || "").split(",").filter(Boolean);

  const iframe = document.createElement("iframe");
  iframe.src = `https://custom-chatbot-widget.netlify.app/bubble?project_id=${projectId}&tags=${encodeURIComponent(tags.join(","))}`;
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "430px";
  iframe.style.height = "480px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.borderRadius = "12px";
  iframe.allowTransparency = true; // 👈 For legacy browser support

  document.body.appendChild(iframe);
})();