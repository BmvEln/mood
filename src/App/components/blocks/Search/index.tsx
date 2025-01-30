import "./style.less";
import Input from "../../controls/Input";
import Select from "../../controls/Select";
import { ACTIVITIES, MOODS } from "../../../static.ts";
import Button from "../../controls/Button";

type SearchProps = {
  searchLocal: string;
  setSearchLocal: (v: string) => void;
  setSearchServer: (v: string) => void;
  moodFilter: number;
  setMoodFilter: (v: number | undefined) => void;
  activeFilter: number;
  setActiveFilter: (v: number | undefined) => void;
  order: boolean;
  setOrder: (v: boolean) => void;
};

function Search({
  searchLocal,
  setSearchLocal,
  setSearchServer,
  setMoodFilter,
  moodFilter,
  activeFilter,
  setActiveFilter,
  order,
  setOrder,
}: SearchProps) {
  return (
    <div className="Search">
      <Input
        width={455}
        value={searchLocal}
        placeholder="Поиск мыслей..."
        onChange={(v) => {
          setSearchLocal(v);
          setSearchServer(v);
        }}
        clear
      />

      <div className="Search__bottom">
        <div className="Search__item">
          <div>По настроению:</div>
          <Select
            onChange={(v) => {
              if (typeof v === "undefined") {
                return setMoodFilter(new Set());
              }

              if (moodFilter.has(v)) {
                moodFilter.delete(v);

                return setMoodFilter(new Set(moodFilter));
              }

              setMoodFilter(new Set(moodFilter.add(v)));
            }}
            variants={MOODS.map((mood) => ({
              id: mood.id,
              name: mood.name,
            }))}
          />
          {MOODS.map(({ id, name }) =>
            Array.from(moodFilter).includes(id) ? (
              <div key={id}>{name}</div>
            ) : null,
          )}
        </div>

        <div className="Search__item">
          <div>По активности:</div>
          <Select
            onChange={(v) => {
              if (typeof v === "undefined") {
                return setActiveFilter(new Set());
              }

              if (activeFilter.has(v)) {
                activeFilter.delete(v);

                return setActiveFilter(new Set(activeFilter));
              }

              setActiveFilter(new Set(activeFilter.add(v)));
            }}
            variants={ACTIVITIES.map((active) => ({
              id: active.id,
              name: active.name,
            }))}
          />
          <div style={{ display: "flex", columnGap: "12px" }}></div>
          {ACTIVITIES.map(({ id, name }, i) =>
            Array.from(activeFilter).includes(id) ? (
              <div key={id}>{name}</div>
            ) : null,
          )}
        </div>

        <div className="Search__item">
          <div>Упорядочить по:</div>
          <Button onClick={() => setOrder(!order)}>{order ? "↑" : "↓"}</Button>
        </div>
      </div>
    </div>
  );
}

export default Search;
