import "./style.less";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FormEvent, useCallback, useState } from "react";
import Input from "../../components/controls/Input";
import Button from "../../components/controls/Button";
import { auth } from "../../../firebase.tsx";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";

/**
 *
 * @param method
 * @constructor
 */
function Auth({ method }: { method: string }) {
  const navigate = useNavigate(),
    [email, setEmail] = useState(""),
    [pass, setPass] = useState(""),
    [error, setError] = useState(""),
    isSingUp = method === "singUp";

  const singUp = useCallback(
    (e: FormEvent<HTMLFormElement>, email: string, password: string) => {
      e.preventDefault();

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          alert(err.message);
          setError(err.message);
        });
    },
    [],
  );

  const singIn = useCallback((e: Event, email: string, password: string) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/notes");
      })
      .catch((err) => {
        alert(err.message);
        setError(err.message);
      });
  }, []);

  const singInAnon = useCallback((e, email: string, pass: string) => {
    e.preventDefault();

    linkWithCredential(
      auth?.currentUser,
      EmailAuthProvider.credential(email, pass),
    )
      .then((usercred) => {
        const user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
        navigate("/notes");
      })
      .catch((error) => {
        console.log("Error upgrading anonymous account", error);
      });
  }, []);

  return (
    <div className="Auth">
      <form
        onSubmit={(e) =>
          auth?.currentUser?.isAnonymous
            ? singInAnon(e, email, pass)
            : isSingUp
              ? singUp(e, email, pass)
              : undefined
        }
        className="Form"
      >
        <Input
          value={email}
          onChange={(v) => setEmail(v)}
          placeholder="Почта"
          type="email"
        />
        <Input
          value={pass}
          onChange={(v) => setPass(v)}
          placeholder="Пароль"
          type="password"
        />

        {error ? <div>{error}</div> : null}

        <Button
          onClick={(e) => (isSingUp ? undefined : singIn(e, email, pass))}
        >
          {isSingUp ? "Зарегистрироваться" : "Войти"}
        </Button>
      </form>
    </div>
  );
}

export default Auth;
