import "./style.less";
import {
  getDayCreateNote,
  getMonthCreateNote,
  getYearCreateNote,
} from "../../functions.tsx";
import SkeletonCard from "../../other/SkeletonCard/SkeletonCard.tsx";
import { NoteItem } from "../../../../redux/slices/notesSlice.tsx";
import { MOODS } from "../../../static.ts";
import Button from "../../controls/Button";
import { useUserActivities } from "../../hooks.tsx";

const MAX_NUM_DISPLAY_ACTIVS = 3;

type NoteGroupProps = {
  data: NoteItem[];
  setIdxCurrNote: (i: number) => void;
  setActivs: (v: Set<number>) => void;
  setMood: (n: number) => void;
  setTextarea: (v: undefined) => void;
  setEditMode: (v: boolean) => void;
  setConfirmWindow: (n: string | undefined) => void;
  sortNotesByDate: {
    [key: string]: NoteItem[];
  };
  idx: number;
};

/**
 *
 * @param data
 * @param activeFilter
 * @param setIdxCurrNote
 * @param setActivs
 * @param setMood
 * @param setTextarea
 * @param setEditMode
 * @param setConfirmWindow
 * @constructor
 */
function NoteGroup({
  data,
  setIdxCurrNote,
  setActivs,
  setMood,
  setTextarea,
  setEditMode,
  setConfirmWindow,
  sortNotesByDate,
  idx,
}: NoteGroupProps) {
  const arrKSortByDate = Object.keys(sortNotesByDate),
    { activitiesList, activitiesLoading } = useUserActivities();

  return (
    <div key={arrKSortByDate[idx]} className="Tracker-group">
      <div className="Tracker-date">
        <div>
          {sortNotesByDate[arrKSortByDate[idx]][0].timestamp.dayWeek.short}
          .,
        </div>
        <div>{getMonthCreateNote(arrKSortByDate[idx])}</div>
        <div>{getDayCreateNote(arrKSortByDate[idx])}</div>
        <div className="separator md" />
        <div>{getYearCreateNote(arrKSortByDate[idx])}</div>
      </div>
      <div className="Tracker-cards">
        {activitiesLoading
          ? Array(4)
              .fill(1)
              .map((_, i) => <SkeletonCard key={i} />)
          : data.map(({ id, timestamp, mood, activities, desc }: NoteItem) => {
              const currMood = MOODS.find((m) => m.id === mood);

              return (
                <div
                  key={id}
                  // TODO Tracker или Note определись
                  className="Tracker-card"
                  style={{ backgroundColor: currMood?.color }}
                  onClick={(e) => {
                    const btnClose = e.target.closest(".Button.close-1-black");

                    if (!btnClose) {
                      setIdxCurrNote(
                        data.findIndex((item: NoteItem) => item.id === id),
                      );
                    }
                  }}
                >
                  <div className="Tracker-card__header">
                    <div>
                      <div>{currMood?.name}</div>
                      <div className="separator md" />
                      <div>{timestamp.time}</div>
                    </div>
                    <div className="Tracker-card__btns">
                      <Button
                        theme="black"
                        onClick={() => {
                          // Сохраняем данные из сервера в state, чтобы в дальнейшем его можно было изменять
                          setActivs(new Set([...activities]));
                          setMood(mood);
                          // Сбрасываем значение, если пользователь ранее что-то написал, но решил не обновлять данные
                          setTextarea(undefined);

                          setIdxCurrNote(
                            data.findIndex((item: NoteItem) => item.id === id),
                          );

                          setEditMode(true);
                        }}
                      >
                        Изменить
                      </Button>
                      <Button
                        theme="close-1-black"
                        onClick={() => setConfirmWindow(id)}
                      />
                    </div>
                  </div>
                  <div className="Tracker-card__spacer" />
                  <div className="Tracker-card__desc">
                    {desc || "Никаких мыслей..."}
                  </div>
                  <div className="Tracker-card__activities">
                    {activities.map((activity: number, k: number) => {
                      const active = activitiesList.find(
                        (m: { id: number; name: string }) => m.id === activity,
                      );

                      return k < MAX_NUM_DISPLAY_ACTIVS ? (
                        <Button key={k} className="noHover" theme="white">
                          {active?.name}
                        </Button>
                      ) : null;
                    })}

                    {activities.length > MAX_NUM_DISPLAY_ACTIVS ? (
                      <Button theme="black-border">Показать все</Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default NoteGroup;
