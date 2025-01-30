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
    // За данными обращаться к notesData
    { notes } = useSelector((state: RootState) => state.notes),
    // true (по возрастанию) | false (по убыванию)
    [order, setOrder] = useState(false),
    notesData = order ? notes : notes.toReversed(),
    [confirmWindow, setConfirmWindow] = useState<number | undefined>(undefined),
    [idxCurrNote, setIdxCurrNote] = useState<number | undefined>(undefined),
    [editMode, setEditMode] = useState<boolean>(false),
    [textarea, setTextarea] = useState<string | undefined>(undefined),
    [activs, setActivs] = useState(new Set()),
    [mood, setMood] = useState<number | undefined>(undefined),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);

  const [moodFilter, setMoodFilter] = useState(new Set()),
    [activeFilter, setActiveFilter] = useState(new Set()),
    [searchLocal, setSearchLocal] = useState<string>(""),
    [searchServer, setSearchServer] = useDebounce("", 600);

  const filterData = notesData.filter((note) => {
    const _moodFilter = Array.from(moodFilter).includes(note.mood);
    // Если [].every = true функция callback не выполняется, т.к. все значения будут тру
    const _activeFilter = Array.from(activeFilter).every((v) =>
      note.activities.includes(v),
    );
    const searchFilter = note.desc.toLowerCase().includes(searchLocal);

    switch (true) {
      case !!(activeFilter.size && moodFilter.size):
        if (_activeFilter && _moodFilter && searchFilter) return true;
        break;
      case !!moodFilter.size:
        if (_moodFilter && searchFilter) return true;
        break;
      // По умолчанию
      case _activeFilter && searchFilter:
        return true;
    }
  });

  const sortNotesByDate = //
      filterData.reduce((all: object, note: NoteItem) => {
        // Проверяем есть ли в объекте массив под нужным ключом
        // если нет, кладём пустой массив
        all[note.timestamp.date] = all[note.timestamp.date] || [];
        // кладём элемент в массив
        all[note.timestamp.date].push(note);

        return all;
      }, {}),
    arrVSortByDate = Object.values(sortNotesByDate),
    arrKSortByDate = Object.keys(sortNotesByDate);

  // TODO: Сделать загрузку не только при получении данных (Но ещё и при добавлении, удалении, обновлении ?? )
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${DATA_URL}`)
      .then((response) => {
        dispatch(setNotes(response.data));
        setLoading(false);
      })
      .catch((error) => setError(error.message));
  }, []);

  // useEffect(() => {
  //   // Если что-то выбрал, то значение используется либо по умолчанию, либо от кнопки изменить
  //   setEditMode(typeof idxCurrNote === "number" && editMode);
  // }, [idxCurrNote]);

  // if (loading) {
  //   return "Пожалуйста подождите, идет загрузка...";
  // }

  console.log(filterData);

  return (
    <>
      <div>
        <div className="Tracker-desc">
          Здесь можете увидеть историю добавленных настроений. Вы можете
          добавлять, <br /> удалять или редактировать любые ранее добавленные
          настроения.
        </div>
        <Search
          order={order}
          setOrder={setOrder}
          searchLocal={searchLocal}
          setSearchLocal={setSearchLocal}
          setSearchServer={setSearchServer}
          moodFilter={moodFilter}
          setMoodFilter={setMoodFilter}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      <div className="Tracker-dashboard">
        {!notesData.length
          ? "На текущий момент записей нет"
          : !arrVSortByDate.length
            ? "Записи не найдены"
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
                                  notesData.findIndex(
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
                                      notesData.findIndex(
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
                                <Button theme="black-border">
                                  Показать все
                                </Button>
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
          setEditMode(false);
        }}
        hideClose
      >
        {/* Гарантируем, что в компоненте будет использоваться нужное значение  */}
        {typeof idxCurrNote !== "number" ? null : (
          <NoteCard
            notesData={notesData}
            idxCurrNote={idxCurrNote}
            setIdxCurrNote={setIdxCurrNote}
            activs={activs}
            setActivs={setActivs}
            mood={mood}
            setMood={setMood}
            textarea={textarea}
            setTextarea={setTextarea}
            setEditMode={setEditMode}
            editMode={editMode}
            setConfirmWindow={setConfirmWindow}
          />
        )}
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
