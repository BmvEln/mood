import "./style.less";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import { useAppDispatch } from "../../../../redux/store.tsx";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase.tsx";
import { setUser } from "../../../../redux/slices/userSlice.tsx";

function MainLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            id: user.uid,
            email: user.email,
            token: user.refreshToken,
          }),
        );
      } else {
        dispatch(
          setUser({
            id: null,
            email: null,
            token: null,
          }),
        );
      }

      return () => listener();
    });
  }, []);

  return (
    <>
      <Header />
      {/*<Menu />*/}
      <Outlet />
    </>
  );
}

export default MainLayout;
