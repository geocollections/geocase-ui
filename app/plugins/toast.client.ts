import iziToast from "izitoast";

type ToastKind = "success" | "error" | "info";
type ToastOptions = Omit<
  Parameters<typeof iziToast.success>[0],
  "message" | "title"
>;

export default defineNuxtPlugin((nuxtApp) => {
  const toast = Object.fromEntries(
    (["success", "error", "info"] as const).map((type: ToastKind) => [
      type,
      (message: string, title: string, options: ToastOptions = {}) =>
        iziToast[type]({ ...options, message, title }),
    ]),
  ) as Record<
    ToastKind,
    (message: string, title: string, options?: ToastOptions) => void
  >;
  nuxtApp.vueApp.config.globalProperties.$toast = toast;
  return { provide: { toast } };
});
