import { useCallback, useRef, useState } from "react";

/**
 *
 * @param init
 * @param delay
 */
export function useDebounce(init, delay) {
  const [innerValue, setInnerValue] = useState(init);
  const timeRef = useRef(null);

  const setValue = useCallback(
    (newValue) => {
      clearTimeout(timeRef.current);
      timeRef.current = setTimeout(() => setInnerValue(newValue), delay);
    },
    [delay],
  );

  return [innerValue, setValue];
}
