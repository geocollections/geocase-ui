import { useSettingsStore } from "@/stores/settings";
import { mapActions, mapState } from "pinia";

interface ToastData {
  text?: string;
  timeout?: number;
}

interface ToastOptions {
  position: "topCenter";
  timeout: number;
  pauseOnHover: false;
  closeOnEscape?: true;
  displayMode?: "replace";
}

interface ToastMixinThis {
  errorMessage: string;
  infoMessage: string;
  $toast: {
    success(message: string, title: string, options: ToastOptions): unknown;
    error(message: string, title: string, options: ToastOptions): unknown;
    info(message: string, title: string, options: ToastOptions): unknown;
  };
  updateErrorState(value: boolean): void;
  updateInfoState(value: boolean): void;
  toastError(data: ToastData): void;
  toastInfo(data: ToastData): void;
}

const toastMixin = {
  computed: {
    ...mapState(useSettingsStore, [
      "error",
      "errorMessage",
      "info",
      "infoMessage",
    ]),
  },

  watch: {
    error(this: ToastMixinThis, newVal: boolean) {
      if (newVal) {
        this.toastError({ text: this.errorMessage });
        this.updateErrorState(false);
      }
    },

    info(this: ToastMixinThis, newVal: boolean) {
      if (newVal) {
        this.toastInfo({ text: this.infoMessage });
        this.updateInfoState(false);
      }
    },
  },

  methods: {
    ...mapActions(useSettingsStore, ["updateErrorState", "updateInfoState"]),

    toastSuccess(this: ToastMixinThis, data: ToastData) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "OK";

      this.$toast.success(data.text!, "OK", {
        position: "topCenter",
        timeout: data.timeout!,
        pauseOnHover: false,
      });
    },

    toastError(this: ToastMixinThis, data: ToastData) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "Error";

      this.$toast.error(data.text!, "Error", {
        position: "topCenter",
        timeout: data.timeout!,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace",
      });
    },

    toastInfo(this: ToastMixinThis, data: ToastData) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "Info";

      this.$toast.info(data.text!, "Info", {
        position: "topCenter",
        timeout: data.timeout!,
        pauseOnHover: false,
      });
    },
  },
};

export default toastMixin;
