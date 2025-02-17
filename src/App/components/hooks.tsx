import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/store.tsx";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.tsx";
import { ACTIVITIES } from "../static.ts";
import { fetchUserActivities } from "../tabsNotes/utils.tsx";

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

/**
 *
 */
export const useUserActivities = () => {
  const [activitiesList, setActivitiesList] = useState([]),
    [activitiesLoading, setActivitiesLoading] = useState(true),
    [activitiesError, setActivitiesError] = useState(Error || null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setActivitiesLoading(true);

        const userId = auth?.currentUser?.uid;

        console.log(userId);

        if (userId) {
          const activities = await fetchUserActivities(userId);
          setActivitiesList(activities);
        }
      } catch (err) {
        setActivitiesError(err as Error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    loadActivities();
  }, [auth?.currentUser]);

  return { activitiesList, activitiesLoading, activitiesError };
};
