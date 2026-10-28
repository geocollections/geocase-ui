export default defineNuxtPlugin((nuxtApp) => {
  if (
    !import.meta.env.PROD ||
    !["geocase.eu", "www.geocase.eu"].includes(window.location.hostname)
  )
    return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-3H583KMKRT", { send_page_view: false });

  window._paq = window._paq || [];
  window._paq.push([
    "setTrackerUrl",
    "https://matomo.geoloogia.info/matomo.php",
  ]);
  window._paq.push(["setSiteId", "4"]);
  window._paq.push(["enableLinkTracking"]);

  useHead({
    script: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-3H583KMKRT",
        async: true,
      },
      { src: "https://matomo.geoloogia.info/matomo.js", async: true },
    ],
  });
  nuxtApp.hook("page:finish", () => {
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
    window._paq.push(["setCustomUrl", window.location.href]);
    window._paq.push(["setDocumentTitle", document.title]);
    window._paq.push(["trackPageView"]);
  });
});
