import iziToast from "izitoast";
export default defineNuxtPlugin((nuxtApp) => {
  const toast = Object.fromEntries(
    ["success", "error", "info"].map((type) => [
      type,
      (message, title, options) =>
        iziToast[type]({ ...options, message, title }),
    ]),
  );
  nuxtApp.vueApp.config.globalProperties.$toast = toast;
  return { provide: { toast } };
});
