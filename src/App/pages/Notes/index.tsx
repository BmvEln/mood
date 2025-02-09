import "./style.less";
import TabsNotes from "../../tabsNotes";
import Page from "../../components/layout/Page";
import classNames from "classnames";
import Button from "../../components/controls/Button";
import { useEffect, useState } from "react";
import { RootState, useAppSelector } from "../../../redux/store.tsx";

function Notes() {
  const tabsNotes = document.getElementById("tabsNotes"),
    page = document.getElementById("page"),
    [btnScrollTop, setBtnScrollTop] = useState(false),
    { idxTab } = useAppSelector((state: RootState) => state.tab),
    endPositionTab =
      // Отступ сверху у tabsNotes + высота шапки
      // + отступ (чтобы кнопка не появлялась сразу после достижения конца элемента) - использовать переменные для первых 2
      tabsNotes && tabsNotes?.scrollHeight + 24 + 50 + 24 - window.innerHeight;

  useEffect(() => {
    // Изменяем стейт не каждый раз при скролле (setState(window.scrollY) - это вызывает лишние перерисовки),
    // а только тогда, когда изменится значение условия (оптимизация)
    const handleScroll = () => {
      if (window.scrollY > endPositionTab) {
        setBtnScrollTop(true);
      }

      if (window.scrollY < endPositionTab) {
        setBtnScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [endPositionTab]);

  return (
    <Page className="Notes">
      <TabsNotes />

      {/* При загрузке вкладки видна кнопка - исправить */}
      {idxTab !== 1 ? null : (
        <div
          className={classNames("btnScrollTop", {
            on: btnScrollTop,
          })}
        >
          <Button onClick={() => page?.scrollIntoView({ behavior: "smooth" })}>
            Прокрутить наверх
          </Button>
        </div>
      )}
    </Page>
  );
}

export default Notes;
