import { useCallback, useRef, useState } from "react";
import { useAppSelector } from "../../redux/store.tsx";

/**
 *
 * @param init
 * @param delay
 */
export function useDebounce(init: any, delay: number) {
  const [innerValue, setInnerValue] = useState(init);
  const timeRef = useRef(null);

  const setValue = useCallback(
    (newValue: any) => {
      clearTimeout(timeRef.current);
      timeRef.current = setTimeout(() => setInnerValue(newValue), delay);
    },
    [delay],
  );

  return [innerValue, setValue];
}

/**
 * Хук для получения данных о пользователе
 */
export const useAuth = () => {
  const { id, email, token } = useAppSelector((state) => state.user);

  return { isAuth: !!id, id, email, token };
};
