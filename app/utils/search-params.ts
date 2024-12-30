export function addSearchParam(key: string, value: string) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  return params.toString();
}

export function removeSearchParam(key: string) {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  return params.toString();
}
