import "./style.less";
import Create from "./Create.tsx";
import Stats from "./Stats.tsx";
import History from "./History.tsx";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store.tsx";
import { setIdxTab } from "../../redux/slices/tabSlice.tsx";

const TABS: { name: string; component: FC }[] = [
  {
    name: "Создание",
    component: Create,
  },
  {
    name: "История",
    component: History,
  },
  {
    name: "Статистика",
    component: Stats,
  },
];

function TabsNotes() {
  const dispatch = useAppDispatch(),
    { idxTab } = useSelector((state: RootState) => state.tab);

  return (
    <div id="tabsNotes" className="TabsNotes">
      {/* Вкладки */}
      <div>
        {TABS.map(({ name }, i) => {
          return (
            <div key={i} onClick={() => dispatch(setIdxTab(i))}>
              {name}
            </div>
          );
        })}
      </div>

      {/* Контент вкладки */}
      {TABS.map(({ component }, i) => {
        const Tab: FC = component;

        return i === idxTab ? <Tab key={i} /> : null;
      })}
    </div>
  );
}

export default TabsNotes;
