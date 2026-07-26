// O access token permanece apenas em memória; este módulo documenta a fronteira de armazenamento.
export const adminAuthStorage = Object.freeze({
  get: () => null,
  set: () => undefined,
  clear: () => undefined,
});
