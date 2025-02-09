import "./style.less";
import { Link } from "react-router-dom";
import { LINK_HOME, LINK_SING_IN, LINK_NOTES } from "../../../static.ts";
import { useCallback } from "react";
import { auth } from "../../../../firebase.tsx";
import { signOut } from "firebase/auth";
import { setUser } from "../../../../redux/slices/userSlice.tsx";
import { useAppDispatch, useAppSelector } from "../../../../redux/store.tsx";

function Header() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.user);

  const userSingOut = useCallback(() => {
    signOut(auth).then(() =>
      dispatch(
        setUser({
          id: null,
          email: null,
          token: null,
        }),
      ),
    );
  }, []);

  return (
    <div className="Header">
      <div className="Header__content">
        <Link to={LINK_HOME}>Настроение</Link>
        <div>
          <div className="Header__signedIn">
            {email ? (
              <span>
                {email}{" "}
                <span className="cursor_pointer" onClick={() => userSingOut()}>
                  (Выйти)
                </span>
              </span>
            ) : (
              "Вы не вошли"
            )}
          </div>
          <Link to={LINK_NOTES}>Записи</Link>
          <Link to={LINK_SING_IN}>Вход</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
