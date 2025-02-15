import { ACTIVITIES } from "../static.ts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.tsx";

/**
 * !!! Изначально у user может не быть activities (появляется после того, как создаст одну карточку)
 * @param userId
 */
export const fetchUserActivities = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().activities || ACTIVITIES;
    }
    return ACTIVITIES;
  } catch (error) {
    console.error("Ошибка при загрузке активностей:", error);
    return ACTIVITIES;
  }
};
