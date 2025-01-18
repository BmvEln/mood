import "./style.less";
import Input from "../../controls/Input";
import Select from "../../controls/Select";
import { ACTIVITIES, MOODS } from "../../../static.ts";

type SearchProps = {
  searchLocal: string;
  setSearchLocal: (v: string) => void;
  setSearchServer: (v: string) => void;
  setMoodFilter: (v: number | undefined) => void;
  activeFilter: number;
  setActiveFilter: (v: number | undefined) => void;
};

function Search({
  searchLocal,
  setSearchLocal,
  setSearchServer,
  setMoodFilter,
  activeFilter,
  setActiveFilter,
}: SearchProps) {
  return (
    <div>
      <Input
        width={200}
        value={searchLocal}
        placeholder="Поиск мыслей..."
        onChange={(v) => {
          setSearchLocal(v);
          setSearchServer(v);
        }}
        clear
      />

      <div>
        <div>Фильтрация по настроению</div>
        <Select
          onChange={setMoodFilter}
          variants={MOODS.map((mood) => ({
            id: mood.id,
            name: mood.name,
          }))}
        />
      </div>

      <div>
        <div>Фильтрация по активности</div>
        <Select
          onChange={setActiveFilter}
          variants={ACTIVITIES.map((active) => ({
            id: active.id,
            name: active.name,
          }))}
        />
      </div>
    </div>
  );
}

export default Search;
