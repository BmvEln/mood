import "./style.less";
import Create from "./Create/Create.tsx";
import Stats from "./Stats/Stats.tsx";
import History from "./History/History.tsx";
import { FC } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../redux/store.tsx";
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
    { idxTab } = useAppSelector((state: RootState) => state.tab);

  return (
    <div id="tabsNotes" className="TabsNotes">
      {/* Вкладки */}
      <div className="TabsNotes__tab">
        {TABS.map(({ name }, i) => {
          return (
            <div
              className={i === idxTab ? "active" : ""}
              key={i}
              onClick={() => dispatch(setIdxTab(i))}
            >
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
