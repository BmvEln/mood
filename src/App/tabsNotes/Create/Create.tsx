import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import Button from "../../components/controls/Button";
import { ACTIVITIES, IMG, MOODS, MONTHS, DAYSWEEK } from "../../static.ts";
import Window from "../../components/layout/Window";
import { db } from "../../../firebase.tsx";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../../redux/store.tsx";
import { v4 as uuidv4 } from "uuid";
import Input from "../../components/controls/Input";
import { useUserActivities } from "../../components/hooks.tsx";
import SkeletonActivity from "../../components/other/SkeletonActivity/SkeletonActivity.tsx";

const getDateInfo = () => {
  const date: Date = new Date(),
    year: number = date.getFullYear(),
    dateMonth: number = date.getDate(),
    dayWeek: number = date.getDay(),
    month: number = date.getMonth(),
    hours: number = date.getHours(),
    minutes: number = date.getMinutes();

  return {
    year,
    dateMonth,
    dayWeek,
    month,
    hours,
    minutes,
  };
};

function Create() {
  const { id } = useAppSelector((state) => state.user),
    [textarea, setTextarea] = useState(""),
    [mood, setMood] = useState<number | undefined>(undefined),
    [activities, setActivities] = useState<Set<number>>(new Set()),
    { activitiesList, activitiesLoading } = useUserActivities(),
    [confirmWindow, setConfirmWindow] = useState(false),
    dateInfo = getDateInfo(),
    dateDB = `${dateInfo.dateMonth.toString().padStart(2, "0")}.${(dateInfo.month + 1).toString().padStart(2, "0")}.${dateInfo.year}`,
    timeDB = `${dateInfo.hours.toString().padStart(2, "0")}:${dateInfo.minutes.toString().padStart(2, "0")}`,
    dayWeekDB = {
      full: DAYSWEEK.full[dateInfo.dayWeek],
      short: DAYSWEEK.short[dateInfo.dayWeek],
    },
    [textNewActivity, setTextNewActivity] = useState(""),
    onClickCreateNote = useCallback(async (userId: string, newItem: object) => {
      const userRef = doc(db, "users", userId),
        userDoc = await getDoc(userRef),
        _newItem = { ...newItem, id: uuidv4() };

      if (userDoc.exists()) {
        // Если документ существует, обновляем массив
        await updateDoc(userRef, {
          items: arrayUnion(_newItem),
        });
      } else {
        // Если документ не существует, создаем его с массивом
        await setDoc(userRef, {
          items: [_newItem],
          activities: [...ACTIVITIES],
        });
      }

      alert("Запись успешно добавлена!");
    }, []),
    onClickCreateActivity = useCallback(
      async (userId: string, activity: string) => {
        const userRef = doc(db, "users", userId),
          userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const items = userDoc.data()?.activities || [],
            newActivity = {
              id: items.length + 1,
              name: activity,
            };

          await updateDoc(userRef, {
            activities: arrayUnion(newActivity),
          });
        }

        alert("Активность успешно добавлена!");
      },
      [],
    );

  console.log(activitiesList);

  return (
    <div className="Create flex flex_column">
      <line className="text_font-20 text_semiBold">
        Запишите свое настроение
      </line>
      <div className="Create__date">
        <div>{DAYSWEEK.short[dateInfo.dayWeek]}.,</div>
        <div>{MONTHS.nominative[dateInfo.month]}</div>
        <div>{dateInfo.dateMonth}</div>
        <div className="separator md" />
        <div>
          {dateInfo.hours.toString().padStart(2, "0")}:
          {dateInfo.minutes.toString().padStart(2, "0")}
        </div>
      </div>

      <line className="text_font-18 text_semiBold">
        Как бы вы описали свое нынешнее настроение?
      </line>

      <div className="Moods">
        {MOODS.map(({ id, name, color, img }, i) => (
          <div
            key={id}
            className={classNames("Moods__item", {
              selected: i + 1 === mood,
            })}
            onClick={() => setMood(id)}
            style={{ backgroundColor: color }}
          >
            <span>{name}</span>
            <img src={IMG[img]} alt="" />
          </div>
        ))}
      </div>

      <line className="text_font-18 text_semiBold">Чем вы занимались?</line>

      <line className="flex" style={{ gap: "12px", width: "900px" }}>
        {activitiesLoading ? (
          <SkeletonActivity />
        ) : (
          activitiesList.map(({ id, name }) => {
            return (
              // TODO: Создать тему ддя кнопки activity и в двух местах использовать
              <div
                key={id}
                className={classNames("btn activity", {
                  selected: Array.from(activities).includes(id),
                })}
                onClick={() => {
                  if (activities.has(id)) {
                    activities.delete(id);

                    return setActivities(new Set(activities));
                  }

                  setActivities(new Set(activities.add(id)));
                }}
              >
                {name}
              </div>
            );
          })
        )}
      </line>

      <line className="upper-middle">
        <Input
          className="isCreate"
          width={170}
          placeholder="Создать активность"
          value={textNewActivity}
          onChange={(v) => setTextNewActivity(v)}
          onSubmit={() => {
            if (!!id && textNewActivity.trim() !== "") {
              onClickCreateActivity(id, textNewActivity);
            }
          }}
          clear={false}
        />
      </line>

      <line className="upper-middle">
        <textarea
          className="textarea"
          style={{ width: "500px", height: "50px" }}
          onChange={(e) => setTextarea(e.target.value)}
          placeholder="Поделитесь дополнительными мыслями..."
          value={textarea}
        />
      </line>

      <Button
        onClick={() => {
          if (typeof mood !== "number" || !activities.size) {
            return setConfirmWindow(true);
          }

          if (typeof id === "string") {
            onClickCreateNote(id, {
              timestamp: {
                date: dateDB,
                time: timeDB,
                dayWeek: dayWeekDB,
              },
              mood: mood,
              activities: Array.from(activities as Set<number>).sort(
                (a, b) => a - b,
              ),
              desc: textarea,
            });
          }
        }}
        width={200}
      >
        Сохранить
      </Button>

      <Window
        open={confirmWindow}
        height={210}
        onClose={() => setConfirmWindow(false)}
        isUnderstand
        confirm={
          <>
            <div style={{ marginBottom: "16px" }}>
              {!mood ? "Не выбрано настроение!" : "Не выбрана активность!"}
            </div>
            <div>
              Для добавления записи необходимо <br /> выбрать{" "}
              {!mood ? "настроение" : "активность(и)"}
            </div>
          </>
        }
      />
    </div>
  );
}

export default Create;
