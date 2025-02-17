import "./App.less";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import {
  LINK_SING_IN,
  LINK_NOTES,
  LINK_SING_UP,
  LINK_PROFILE,
} from "./static.ts";
import "../firebase.tsx";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={LINK_NOTES} element={<Notes />} />
          <Route path={LINK_SING_IN} element={<Auth method="singIn" />} />
          <Route path={LINK_SING_UP} element={<Auth method="singUp" />} />
          <Route path={LINK_PROFILE} element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
