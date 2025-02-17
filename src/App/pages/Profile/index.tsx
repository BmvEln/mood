import React, { useCallback } from "react";
import "./style.less";
import Button from "../../components/controls/Button";
import { setUser } from "../../../redux/slices/userSlice.tsx";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.tsx";
import { useAppDispatch } from "../../../redux/store.tsx";
import { Link, useNavigate } from "react-router-dom";
import { LINK_NOTES } from "../../static.ts";

function Profile() {
  const dispatch = useAppDispatch(),
    navigate = useNavigate(),
    userSingOut = useCallback(() => {
      signOut(auth).then(() => {
        dispatch(
          setUser({
            id: null,
            email: null,
            token: null,
          }),
        );

        navigate("/");
      });
    }, []);

  return (
    <div className="Profile">
      <div className="Profile__panel">
        <div className="Profile__title">Профиль</div>

        <div className="Profile__separator" />

        <div className="Profile__subtitle">Регистрационная информация</div>

        <div className="Profile__login-info">
          <div>
            <div>Почта</div>
            <div>
              <div>{auth?.currentUser?.email}</div>
              <Button onClick={() => alert("Функционал в разработке ฅ^•ﻌ•^ฅ")}>
                Изменить
              </Button>
            </div>
          </div>
          <div>
            <div>Пароль</div>
            <div>
              <div>******</div>
              <Button onClick={() => alert("Функционал в разработке ฅ^•ﻌ•^ฅ")}>
                Изменить
              </Button>
            </div>
          </div>
        </div>

        <div className="Profile__separator" />

        <div className="Profile__creationTime">
          <div>Дата создания личного кабинета:</div>
          <div>{auth?.currentUser?.metadata.creationTime}</div>
        </div>

        <div className="Profile__separator" />

        <Button onClick={() => userSingOut()}>Выйти из кабинета</Button>
      </div>

      <Link to={LINK_NOTES}>
        <Button style={{ position: "absolute", top: 0, left: "60px" }}>
          ← К настроениям
        </Button>
      </Link>
    </div>
  );
}

export default Profile;
