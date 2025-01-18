import "./App.less";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import { LINK_LOGIN, LINK_NOTES } from "./static.ts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={LINK_NOTES} element={<Notes />} />
          <Route path={LINK_LOGIN} element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
