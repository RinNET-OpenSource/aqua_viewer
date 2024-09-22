export function debounce(
  func: (...args: any) => any,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  // tslint:disable-next-line:variable-name
  const _debounce = function(...args: any[]) {
    if (timer) { clearTimeout(timer); }

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  _debounce.cancel = () => {
    if (timer) { clearTimeout(timer); }
  };

  return _debounce;
}
