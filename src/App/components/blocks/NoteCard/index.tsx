import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import "./style.less";
import { ACTIVITIES, IMG, MOODS } from "../../../static.ts";
import classNames from "classnames";
import { NoteItem } from "../../../../redux/slices/notesSlice.tsx";
import Button from "../../controls/Button";
import Window from "../../layout/Window";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase.tsx";
import { useAppSelector } from "../../../../redux/store.tsx";
import { useUserActivities } from "../../hooks.tsx";

type NoteCard = {
  notesData: NoteItem[];
  idxCurrNote: number;
  setIdxCurrNote: (idx: number | undefined) => void;
  activs: Set<number>;
  setActivs: (activs: number[] | Set<number>) => void;
  mood: number | undefined;
  setMood: (mood: number) => void;
  textarea: string | undefined;
  setTextarea: (textarea: string) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  setConfirmWindow: (id: string) => void;
};

function NoteCard({
  idxCurrNote,
  setIdxCurrNote,
  activs,
  setActivs,
  mood,
  setMood,
  textarea,
  setTextarea,
  editMode,
  setEditMode,
  setConfirmWindow,
  notesData,
}: NoteCard) {
  const { id } = useAppSelector((state) => state.user),
    [activePopUp, setActivePopUp] = useState(false),
    [activeWindow, setActiveWindow] = useState(false),
    refMood = useRef<HTMLDivElement | null>(null),
    // Берем значение справа если mood не определен
    moodId = mood || notesData[idxCurrNote].mood,
    currMood = MOODS.find((mood) => mood.id === moodId),
    { activitiesList, activitiesLoading, activitiesError } =
      useUserActivities(),
    windowDetails = document.getElementById("window-details"),
    onClickUpdateNote = useCallback(
      async (userId: string, itemId: string, updatedData: object) => {
        try {
          const userRef = doc(db, "users", userId),
            userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const items = userDoc.data()?.items || [];
            const itemIdx = items.findIndex(
              (item: NoteItem) => item.id === itemId,
            );

            if (itemIdx !== -1) {
              // Создаем новый массив с обновленным элементом
              const updatedItems = items.map((item: NoteItem) =>
                item.id === itemId ? { ...item, ...updatedData } : item,
              );

              // Обновляем массив items в документе
              await updateDoc(userRef, {
                items: updatedItems,
              });
              alert("Запись успешно изменена!");
            } else {
              alert("Запись с указанным ID не найдена.");
            }
          } else {
            alert("Документ пользователя не существует.");
          }
        } catch (err) {
          console.error("Ошибка при изменении записи:", err);
          alert("Произошла ошибка при изменении записи.");
        }
      },
      [notesData],
    );

  useLayoutEffect(() => {
    const mouseClickHandler = (e: MouseEvent) => {
      if (
        refMood.current &&
        !e.composedPath().includes(refMood.current as EventTarget)
      ) {
        setActivePopUp(false);
      }
    };

    if (windowDetails) {
      windowDetails.addEventListener("click", mouseClickHandler);
    }

    return () =>
      windowDetails
        ? windowDetails.removeEventListener("click", mouseClickHandler)
        : undefined;
  }, [idxCurrNote]);

  return (
    <>
      <div className="NoteCard">
        <div className="NoteCard__datetime">
          <div
            onClick={() => {
              if (idxCurrNote > 0) {
                setIdxCurrNote(idxCurrNote - 1);

                setActivs([...notesData[idxCurrNote - 1]?.activities]);
                setMood(notesData[idxCurrNote - 1].mood);
              }
            }}
            style={{
              opacity: Number(idxCurrNote !== 0),
              cursor: idxCurrNote !== 0 ? "pointer" : "default",
            }}
          />
          <div>
            <div>
              {notesData[idxCurrNote].timestamp.date}_
              {notesData[idxCurrNote].timestamp.time}
            </div>
            <div className="separator md" />
            <div>
              {idxCurrNote + 1} / {notesData.length}
            </div>
          </div>
          <div
            onClick={() => {
              if (idxCurrNote !== notesData.length - 1) {
                setIdxCurrNote(idxCurrNote + 1);

                setActivs([...notesData[idxCurrNote + 1]?.activities]);
                setMood(notesData[idxCurrNote + 1].mood);
              }
            }}
            style={{
              opacity: Number(idxCurrNote !== notesData.length - 1),
              cursor:
                idxCurrNote !== notesData.length - 1 ? "pointer" : "default",
            }}
          />
        </div>
        <div className="NoteCard__btns">
          {!editMode ? (
            <div className="NoteCard__mood_readable">{currMood?.name}</div>
          ) : (
            <div
              className="NoteCard__mood"
              ref={refMood}
              onClick={() => setActivePopUp(!activePopUp)}
              style={{ backgroundColor: currMood?.color }}
            >
              <div>
                <div>{currMood?.name}</div>

                {currMood?.img ? (
                  <img src={IMG[currMood.img]} width={22} height={22} alt="" />
                ) : null}
              </div>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0001 19.1501L15.8751 15.2751C16.0751 15.0751 16.3084 14.9751 16.5751 14.9751C16.8418 14.9751 17.0751 15.0751 17.2751 15.2751C17.4751 15.4751 17.5751 15.7126 17.5751 15.9876C17.5751 16.2626 17.4751 16.5001 17.2751 16.7001L13.4251 20.5751C13.0418 20.9584 12.5668 21.1501 12.0001 21.1501C11.4334 21.1501 10.9584 20.9584 10.5751 20.5751L6.70011 16.7001C6.50011 16.5001 6.40428 16.2626 6.41261 15.9876C6.42094 15.7126 6.52511 15.4751 6.72511 15.2751C6.92511 15.0751 7.16261 14.9751 7.43761 14.9751C7.71261 14.9751 7.95011 15.0751 8.15011 15.2751L12.0001 19.1501ZM12.0001 4.8501L8.15011 8.7001C7.95011 8.9001 7.71678 8.99593 7.45011 8.9876C7.18344 8.97926 6.95011 8.88343 6.75011 8.7001C6.55011 8.5001 6.44594 8.2626 6.43761 7.9876C6.42928 7.7126 6.52511 7.4751 6.72511 7.2751L10.5751 3.4251C10.9584 3.04176 11.4334 2.8501 12.0001 2.8501C12.5668 2.8501 13.0418 3.04176 13.4251 3.4251L17.2751 7.2751C17.4751 7.4751 17.5709 7.7126 17.5626 7.9876C17.5543 8.2626 17.4501 8.5001 17.2501 8.7001C17.0501 8.88343 16.8168 8.97926 16.5501 8.9876C16.2834 8.99593 16.0501 8.9001 15.8501 8.7001L12.0001 4.8501Z"
                  fill="#333132"
                />
              </svg>

              <div
                className="NoteCard__popUp"
                style={{
                  maxHeight: activePopUp ? "170px" : 0,
                }}
              >
                {MOODS.map(({ id, name, color, img }, i) => (
                  <div
                    key={id}
                    className={classNames({
                      // TODO: Пока нет эффекта "Выбранный"
                      selected: i + 1 === mood,
                    })}
                    onClick={() => setMood(id)}
                    style={{ "--bC-popUp-item": color } as React.CSSProperties}
                  >
                    <div>{name}</div>
                    <img src={IMG[img]} alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            {!editMode ? (
              <>
                <Button
                  theme="edit"
                  size="big"
                  onClick={() => {
                    setEditMode(true);

                    setActivs(new Set([...notesData[idxCurrNote].activities]));
                  }}
                />
                <Button
                  theme="delete"
                  size="big"
                  onClick={() => setConfirmWindow(notesData[idxCurrNote].id)}
                />
              </>
            ) : (
              <Button
                theme="blue"
                size="big"
                onClick={() => setActiveWindow(true)}
              >
                Обновить
              </Button>
            )}
            <Button
              theme="close-2-blue"
              size="big"
              onClick={() => setIdxCurrNote(undefined)}
            />
          </div>
        </div>

        {notesData[idxCurrNote].desc || editMode ? (
          <textarea
            className="textarea"
            name="noteCardDesc"
            onChange={(e) => setTextarea(e.target.value)}
            readOnly={!editMode}
            value={
              typeof textarea === "string" || textarea === ""
                ? textarea
                : notesData[idxCurrNote].desc
            }
          />
        ) : (
          <div className="NoteCard__withoutThoughts">
            <div style={{ backgroundImage: `url("${IMG.box}")` }} />
            <div>Никаких мыслей</div>
          </div>
        )}

        {/*NoteCard__activities*/}
        <div className="NoteCard__activities">
          {activitiesList.map(({ id, name }) => {
            if (!editMode && notesData[idxCurrNote].activities?.includes(id)) {
              return (
                // TODO: Создать тему ддя кнопки activity и в двух местах использовать
                <div
                  key={id}
                  className={classNames("NoteCard__activity", {
                    noHover: !editMode,
                  })}
                >
                  {name}
                </div>
              );
            }

            if (editMode) {
              return (
                // TODO: Создать тему ддя кнопки activity и в двух местах использовать
                <div
                  key={id}
                  className={classNames("NoteCard__activity", {
                    selected: Array.from(activs).includes(id),
                  })}
                  onClick={() => {
                    if (activs.has(id)) {
                      activs.delete(id);

                      return setActivs(new Set([...activs]));
                    }

                    setActivs(new Set(activs.add(id)));
                  }}
                >
                  {name}
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Нужно подумать как сделать, чтобы было по центру */}
      <Window
        open={activeWindow}
        onClose={() => setActiveWindow(false)}
        confirm="Вы точно хотите ИЗМЕНИТЬ заметку?"
        onClickYes={() => {
          const currNote = notesData[idxCurrNote];

          if (typeof id === "string") {
            onClickUpdateNote(id, currNote.id, {
              ...currNote,
              mood: mood || currNote.mood,
              activities: Array.from(activs).sort((a, b) => a - b),
              desc: textarea || "",
            });

            setActiveWindow(false);
          }
        }}
      />
    </>
  );
}

export default NoteCard;
