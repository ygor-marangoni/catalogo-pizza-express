const KEY = "pizza-express.admin-access-token";
const available = () => typeof window !== "undefined" && Boolean(window.sessionStorage);

export const adminAuthStorage = Object.freeze({
  get: () => available() ? window.sessionStorage.getItem(KEY) : null,
  set: (token) => { if (available()) window.sessionStorage.setItem(KEY, token); },
  clear: () => { if (available()) window.sessionStorage.removeItem(KEY); },
});
