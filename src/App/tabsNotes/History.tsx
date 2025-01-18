import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { ACTIVITIES, MOODS } from "../static.ts";
import { NoteItem, setNotes } from "../../redux/slices/notesSlice.tsx";
import Button from "../components/controls/Button";
import { RootState, useAppDispatch } from "../../redux/store.tsx";
import Window from "../components/layout/Window";
import NoteCard from "../components/blocks/NoteCard";
import { deleteNote } from "./utils.tsx";
import {
  getDayCreateNote,
  getMonthCreateNote,
  getYearCreateNote,
} from "../components/functions.tsx";
import { useDebounce } from "../components/hooks.tsx";
import Search from "../components/blocks/Search";
import { DATA_URL } from "../assets/api.tsx";

const MAX_NUM_DISPLAY_ACTIVS = 3;

function History() {
  const dispatch = useAppDispatch(),
    { notes } = useSelector((state: RootState) => state.notes),
    // Переворачиваем, чтобы новые записи были сверху
    notesReverse = notes.toReversed(),
    [note, setNote] = useState({}),
    [confirmWindow, setConfirmWindow] = useState<number | undefined>(undefined),
    [idxCurrNote, setIdxCurrNote] = useState<number | undefined>(undefined),
    [editMode, setEditMode] = useState<boolean>(false),
    [textarea, setTextarea] = useState<string | undefined>(undefined),
    [activs, setActivs] = useState(new Set()),
    [mood, setMood] = useState<number | undefined>(undefined),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    sortNotesByDate = notesReverse.reduce((all: object, note: NoteItem) => {
      // Проверяем есть ли в объекте массив под нужным ключом
      // если нет, кладём пустой массив
      all[note.timestamp.date] = all[note.timestamp.date] || [];
      // кладём элемент в массив
      all[note.timestamp.date].push(note);

      return all;
    }, {}),
    arrVSortByDate = Object.values(sortNotesByDate),
    arrKSortByDate = Object.keys(sortNotesByDate),
    [searchLocal, setSearchLocal] = useState<string>(""),
    [searchServer, setSearchServer] = useDebounce("", 600),
    [moodFilter, setMoodFilter] = useState<number | undefined>(undefined),
    [activeFilter, setActiveFilter] = useState<number | undefined>(undefined);

  // TODO: Сделать загрузку не только при получении данных (Но ещё и при добавлении, удалении, обновлении ?? )
  useEffect(() => {
    const moodParameter = moodFilter ? `mood=${moodFilter}` : "";

    setLoading(true);
    axios
      .get(`${DATA_URL}?${moodParameter}&desc=*${searchServer}`)
      .then((response) => {
        dispatch(setNotes(response.data));
        setLoading(false);
      })
      .catch((error) => setError(error.message));
  }, [searchServer, moodFilter]);

  useEffect(() => {
    // notes[undefined] - допускается в js, ошибки не последует - будет undefined
    setNote(notesReverse[idxCurrNote]);
    // Если что-то выбрал, то значение используется либо по умолчанию, либо от кнопки изменить
    setEditMode(typeof idxCurrNote === "number" && editMode);
  }, [idxCurrNote]);

  // if (loading) {
  //   return "Пожалуйста подождите, идет загрузка...";
  // }

  return (
    <>
      <Search
        searchLocal={searchLocal}
        setSearchLocal={setSearchLocal}
        setSearchServer={setSearchServer}
        setMoodFilter={setMoodFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="Tracker-dashboard">
        <div className="Tracker-desc">
          Здесь можете увидеть историю добавленных настроений. Вы можете
          добавлять, <br /> удалять или редактировать любые ранее добавленные
          настроения.
        </div>
        {!notes.length
          ? "На текущий момент записей нет"
          : arrVSortByDate.map((arrayNotes, i) => (
              <div key={arrKSortByDate[i]} className="Tracker-group">
                <div className="Tracker-date">
                  <div>
                    {
                      sortNotesByDate[arrKSortByDate[i]][0].timestamp.dayWeek
                        .short
                    }
                    .,
                  </div>
                  <div>{getMonthCreateNote(arrKSortByDate[i])}</div>
                  <div>{getDayCreateNote(arrKSortByDate[i])}</div>
                  <div className="separator md" />
                  <div>{getYearCreateNote(arrKSortByDate[i])}</div>
                </div>
                <div className="Tracker-cards">
                  {arrayNotes.map(
                    ({ id, timestamp, mood, activities, desc }: NoteItem) => {
                      const currMood = MOODS.find((m) => m.id === mood);
                      return (
                        <div
                          key={id}
                          // TODO Tracker или Note определись
                          className="Tracker-card"
                          style={{ backgroundColor: currMood?.color }}
                          onClick={(e) => {
                            const btnClose = e.target.closest(
                              ".Button.close-1-black",
                            );

                            if (!btnClose) {
                              setIdxCurrNote(
                                notesReverse.findIndex(
                                  (item: NoteItem) => item.id === id,
                                ),
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
                                    notesReverse.findIndex(
                                      (item: NoteItem) => item.id === id,
                                    ),
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
                              const active = ACTIVITIES.find(
                                (m) => m.id === activity,
                              );

                              return k < MAX_NUM_DISPLAY_ACTIVS ? (
                                <Button
                                  key={k}
                                  className="noHover"
                                  theme="white"
                                >
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
                    },
                  )}
                </div>
              </div>
            ))}
      </div>

      <Window
        id="window-details"
        open={typeof idxCurrNote === "number"}
        onClose={() => {
          setIdxCurrNote(undefined);
        }}
        hideClose
      >
        <NoteCard
          notesReverse={notesReverse}
          note={note}
          idxCurrNote={idxCurrNote}
          setIdxCurrNote={setIdxCurrNote}
          activs={activs}
          setActivs={setActivs}
          mood={mood}
          setMood={setMood}
          textarea={textarea}
          setTextarea={setTextarea}
          setEditMode={setEditMode}
          readOnly={!editMode}
          setConfirmWindow={setConfirmWindow}
        />
      </Window>

      <Window
        open={typeof confirmWindow === "number"}
        onClose={() => setConfirmWindow(undefined)}
        confirm="Вы точно хотите УДАЛИТЬ заметку?"
        onClickYes={() => {
          if (typeof confirmWindow === "number") {
            deleteNote(confirmWindow);
            dispatch(
              setNotes(notes.filter((item) => item.id !== confirmWindow)),
            );

            setConfirmWindow(undefined);
            setIdxCurrNote(undefined);
          }
        }}
      />
    </>
  );
}

export default History;
