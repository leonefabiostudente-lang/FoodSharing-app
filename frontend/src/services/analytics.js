let gaMeasurementId = "";

export function initAnalytics(measurementId) {
  gaMeasurementId = measurementId || "";

  if (!gaMeasurementId) {
    return;
  }

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId, { send_page_view: false });
}

export function trackPageView(path, title) {
  if (!gaMeasurementId || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
    send_to: gaMeasurementId
  });
}

export function trackEvent(eventName, params = {}) {
  if (!gaMeasurementId || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    ...params,
    send_to: gaMeasurementId
  });
}
