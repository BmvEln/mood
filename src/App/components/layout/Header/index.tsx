import "./style.less";
import { Link } from "react-router-dom";
import { LINK_HOME, LINK_LOGIN, LINK_NOTES } from "../../../static.ts";

function Header() {
  return (
    <div className="Header">
      <div className="Header__content">
        <Link to={LINK_HOME}>Настроение</Link>
        <div>
          <Link to={LINK_NOTES}>Записи</Link>
          <Link to={LINK_LOGIN}>Вход</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
