import "./App.less";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import { onAuthStateChanged } from "firebase/auth";
import { LINK_SING_IN, LINK_NOTES, LINK_SING_UP } from "./static.ts";
import "../firebase.tsx";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/store.tsx";
import { auth } from "../firebase.tsx";
import { setUser } from "../redux/slices/userSlice.tsx";

function App() {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={LINK_NOTES} element={<Notes />} />
          <Route path={LINK_SING_IN} element={<Auth method="singIn" />} />
          <Route path={LINK_SING_UP} element={<Auth method="singUp" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
