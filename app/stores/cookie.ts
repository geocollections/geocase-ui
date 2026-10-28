import { defineStore } from "pinia";

export const useCookieStore = defineStore("cookie", {
  state: () => ({
    cookieLaw: true,
  }),
  getters: {},
  actions: {
    UPDATE_COOKIE_LAW(bool: boolean) {
      this.cookieLaw = bool;
    },
    closeCookieLaw() {
      this.UPDATE_COOKIE_LAW(false);
    },
  },
});
