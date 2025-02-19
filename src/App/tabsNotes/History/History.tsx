import { useCallback, useEffect, useState } from "react";
import { ACTIVITIES, MOODS } from "../../static.ts";
import { NoteItem, setNotes } from "../../../redux/slices/notesSlice.tsx";
import Button from "../../components/controls/Button";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store.tsx";
import Window from "../../components/layout/Window";
import NoteCard from "../../components/blocks/NoteCard";
import {
  getDayCreateNote,
  getMonthCreateNote,
  getYearCreateNote,
} from "../../components/functions.tsx";
import { useDebounce, useUserActivities } from "../../components/hooks.tsx";
import Search from "../../components/blocks/Search";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase.tsx";
import { arrayRemove } from "@firebase/firestore";
import SkeletonCard from "../../components/other/SkeletonCard/SkeletonCard.tsx";
import Dashboard from "../../components/blocks/NoteGroup";
import NoteGroup from "../../components/blocks/NoteGroup";

function History() {
  const dispatch = useAppDispatch(),
    { id } = useAppSelector((state) => state.user),
    // За данными обращаться к notesData
    { notes } = useAppSelector((state: RootState) => state.notes),
    // true (по возрастанию) | false (по убыванию)
    [order, setOrder] = useState(false),
    notesData = order ? notes : notes.toReversed(),
    [confirmWindow, setConfirmWindow] = useState<string | undefined>(undefined),
    [idxCurrNote, setIdxCurrNote] = useState<number | undefined>(undefined),
    [editMode, setEditMode] = useState<boolean>(false),
    [textarea, setTextarea] = useState<string | undefined>(undefined),
    [activs, setActivs] = useState<Set<number>>(new Set()),
    [mood, setMood] = useState<number | undefined>(undefined),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);

  const [moodFilter, setMoodFilter] = useState<Set<number>>(new Set()),
    [activeFilter, setActiveFilter] = useState<Set<number>>(new Set()),
    [searchLocal, setSearchLocal] = useState<string>(""),
    [searchServer, setSearchServer] = useDebounce("", 600);

  const filterData = notesData.filter((note: NoteItem) => {
      // Проверка наличия фильтров
      const hasActiveFilter = activeFilter.size > 0,
        hasMoodFilter = moodFilter.size > 0,
        // Проверка соответствия заметки фильтрам
        matchesMood = Array.from(moodFilter).includes(note.mood),
        // Если [].every = true функция callback не выполняется, т.к. все значения будут true
        matchesActivities = Array.from(activeFilter).every((v) =>
          note.activities.includes(v),
        ),
        matchesSearch = note.desc
          .toLowerCase()
          .includes(searchLocal.toLowerCase());

      if (hasActiveFilter && hasMoodFilter) {
        return matchesActivities && matchesMood && matchesSearch;
      } else if (hasMoodFilter) {
        return matchesMood && matchesSearch;
      } else {
        return matchesActivities && matchesSearch;
      }
    }),
    sortNotesByDate = filterData.reduce(
      (all: { [key: string]: NoteItem[] }, note: NoteItem) => {
        // Проверяем есть ли в объекте массив под нужным ключом
        // если нет, кладём пустой массив
        all[note.timestamp.date] = all[note.timestamp.date] || [];
        all[note.timestamp.date].push(note);

        return all;
      },
      {},
    ),
    arrVSortByDate = Object.values(sortNotesByDate),
    onClickDeleteNote = useCallback(async (userId: string, itemId: string) => {
      try {
        // Ссылка на документ пользователя
        const userRef = doc(db, "users", userId),
          // Получаем текущий документ пользователя
          userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Извлекаем массив items из документа
          const items = userDoc.data()?.items || [];
          const item = items.find((item: NoteItem) => item.id === itemId);

          if (item) {
            // Удаляем элемент из массива
            await updateDoc(userRef, {
              items: arrayRemove(item),
            });
            alert("Запись успешно удалена!");
          } else {
            alert("Запись с указанным ID не найдена.");
          }
        } else {
          alert("Документ пользователя не существует.");
        }
      } catch (err) {
        console.error("Ошибка при удалении записи:", err);
        alert("Произошла ошибка при удалении записи.");
      }
    }, []);

  // TODO: Сделать загрузку не только при получении данных (Но ещё и при добавлении, удалении, обновлении ?? )
  useEffect(() => {
    setLoading(true);
    // Нужно ли завернуть в callback?
    const getUserData = async (userId: string) => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        dispatch(setNotes(userDoc.data().items));
      } else {
        console.log("Пользователь не создавал записи");
        return null;
      }

      setLoading(false);
    };

    getUserData(id);
  }, []);

  // if (loading) {
  //   return "Пожалуйста подождите, идет загрузка...";
  // }

  console.log(1213);
  console.log(sortNotesByDate);

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
            : arrVSortByDate.map((_, idx) => (
                <NoteGroup
                  idx={idx}
                  data={notesData}
                  setIdxCurrNote={setIdxCurrNote}
                  setActivs={setActivs}
                  setMood={setMood}
                  setTextarea={setTextarea}
                  setEditMode={setEditMode}
                  setConfirmWindow={setConfirmWindow}
                  sortNotesByDate={sortNotesByDate}
                />
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
        open={typeof confirmWindow === "string"}
        onClose={() => setConfirmWindow(undefined)}
        confirm="Вы точно хотите УДАЛИТЬ заметку?"
        onClickYes={() => {
          if (typeof confirmWindow === "string") {
            onClickDeleteNote(id, confirmWindow);

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
