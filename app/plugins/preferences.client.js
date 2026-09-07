import { useSettingsStore } from "@/stores/settings";
import { useCookieStore } from "@/stores/cookie";
export default defineNuxtPlugin(() => {
  const settings = useSettingsStore();
  const cookie = useCookieStore();
  const key = "GeoCASE_v1.1.1";
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (["en", "ee", "de"].includes(saved?.settings?.language))
      settings.language = saved.settings.language;
    if (typeof saved?.cookie?.cookieLaw === "boolean")
      cookie.cookieLaw = saved.cookie.cookieLaw;
  } catch {
    /* Storage may be disabled or contain data from an older session. */
  }
  const persist = () => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          settings: { language: settings.language },
          cookie: { cookieLaw: cookie.cookieLaw },
        }),
      );
    } catch {
      /* Keep preferences in memory when storage is unavailable. */
    }
  };
  settings.$subscribe(persist, { detached: true });
  cookie.$subscribe(persist, { detached: true });
});
