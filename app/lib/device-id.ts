/**
 * Anonymous device identification — no login, no signup.
 * Each browser gets a UUID stored in localStorage.
 */

const KEY = "ai-content-structurer-device-id";

function uuidv4(): string {
  // RFC4122 v4 — works without crypto.randomUUID for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (window.crypto && "randomUUID" in window.crypto)
      ? (window.crypto as Crypto).randomUUID()
      : uuidv4();
    localStorage.setItem(KEY, id);
  }
  return id;
}
