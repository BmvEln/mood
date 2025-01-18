import "./style.less";
import { Outlet } from "react-router-dom";
import Header from "../Header";

function MainLayout() {
  return (
    <>
      <Header />
      {/*<Menu />*/}
      <Outlet />
    </>
  );
}

export default MainLayout;
