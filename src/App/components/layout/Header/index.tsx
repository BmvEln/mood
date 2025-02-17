import "./style.less";
import { Link } from "react-router-dom";
import {
  LINK_HOME,
  LINK_SING_IN,
  LINK_NOTES,
  LINK_SING_UP,
  LINK_PROFILE,
} from "../../../static.ts";
import Button from "../../controls/Button";
import { useAppSelector } from "../../../../redux/store.tsx";

function Header() {
  const { email } = useAppSelector((state) => state.user);

  return (
    <div className="Header">
      <div className="Header__content">
        <Link to={LINK_HOME}>Настроение</Link>
        <div>
          <div className="Header__signedIn">
            {email ? (
              <Link to={LINK_PROFILE}>
                <div className="Header__profile-img">{email.slice(0, 1)}</div>
              </Link>
            ) : (
              <div className="Header__accession">
                <Link to={LINK_SING_IN}>
                  <Button>Войти</Button>
                </Link>

                <Link to={LINK_SING_UP}>
                  <Button>Регистрация</Button>
                </Link>
              </div>
            )}
          </div>
          <Link to={LINK_NOTES}>Записи</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
