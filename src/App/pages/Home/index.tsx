import "./style.less";
import { Link } from "react-router-dom";
import { LINK_SING_IN, LINK_SING_UP, LINK_NOTES } from "../../static.ts";
import { auth } from "../../../firebase.tsx";
import { signInAnonymously } from "firebase/auth";

const STEPS = [
  {
    img: 1,
    title: "ВОЙДИТЕ В СИСТЕМУ",
    desc: (
      <>
        Регистрируйте свое настроение <br /> каждый день вместе с тем, <br />{" "}
        что влияет на него в данный момент.
      </>
    ),
  },
  {
    img: 2,
    title: "ОТСЛЕЖИВАЙТЕ",
    desc: (
      <>
        Посмотрите, как меняется ваше <br /> настроение с течением времени.
      </>
    ),
  },
  {
    img: 3,
    title: "УЗНАЙТЕ",
    desc: (
      <>
        Определите закономерности и триггеры, <br /> которые могут вызывать
        перепады настроения.
      </>
    ),
  },
];

function Home() {
  const signInAnon = () => {
    signInAnonymously(auth)
      .then((v) => {
        console.log("signInAnonymously", v);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="Home">
      <div className="Home__title">Отслеживание настроения</div>

      <div className="Home__text">
        С помощью бесплатного отслеживания настроения вы можете выявлять
        закономерности <br /> в изменениях настроения и узнавать, как сон, диета
        и другие повседневные действия влияют на ваши эмоции.
      </div>

      <div className="Home__steps">
        {STEPS.map(({ img, title, desc }, i) => (
          <div key={i}>
            <div className="img">{img}</div>
            <div>
              {i + 1}. {title}
            </div>
            <div>{desc}</div>
          </div>
        ))}
      </div>

      <div className="Home__text">
        <span className="text_underline cursor_pointer">
          <Link to={LINK_SING_IN}>Войдите</Link>
        </span>{" "}
        в свою учетную запись, чтобы начать, или{" "}
        <span className="text_underline cursor_pointer">
          <Link to={LINK_SING_UP}>создайте</Link>
        </span>{" "}
        новую учетную запись.
      </div>

      <div className="Home__text">Начало работы</div>

      <div className="Home__text">
        <span className="text_underline cursor_pointer">
          <Link to={LINK_NOTES} onClick={() => signInAnon()}>
            Пропустить этот шаг.
          </Link>
        </span>{" "}
        Я войду в систему позже, чтобы сохранить свои зарегистрированные
        настроения.
      </div>
    </div>
  );
}

export default Home;
