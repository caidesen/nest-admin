export function setToken(token: string, expireAt: Date, autoLogin: boolean) {
  const value = JSON.stringify({
    code: token,
    expireAt,
  });
  if (autoLogin) localStorage.setItem("token", value);
  else sessionStorage.setItem("token", value);
}

export function getToken() {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");
  if (!token) return null;
  const data = JSON.parse(token);
  if (data.expireAt < new Date()) return null;
  return data.code;
}
