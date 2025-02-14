import { useCallback, useState } from "react";
import classNames from "classnames";
import Button from "../components/controls/Button";
import { ACTIVITIES, IMG, MOODS, MONTHS, DAYSWEEK } from "../static.ts";
import { createNote } from "./utils.tsx";
import Window from "../components/layout/Window";

function Create() {
  const [textarea, setTextarea] = useState(""),
    [mood, setMood] = useState<number | undefined>(undefined),
    // TODO: Сделать другой способ
    [activities, setActivities] = useState(new Set()),
    date: Date = new Date(),
    year: number = date.getFullYear(),
    dateMonth: number = date.getDate(),
    dayWeek: number = date.getDay(),
    month: number = date.getMonth(),
    hours: number = date.getHours(),
    minutes: number = date.getMinutes(),
    dateDB = `${dateMonth.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}.${year}`,
    timeDB = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    dayWeekDB = {
      full: DAYSWEEK.full[dayWeek],
      short: DAYSWEEK.short[dayWeek],
    },
    onClickCreateNote = useCallback((note: object) => {
      createNote(note);

      // Сбрасываем значения после создания записи
      setMood(undefined);
      setActivities(new Set());
      setTextarea("");

      window.scroll(0, 0);
    }, []),
    [confirmWindow, setConfirmWindow] = useState(false);

  return (
    <div className="Create flex flex_column">
      <line className="text_font-20 text_semiBold">
        Запишите свое настроение
      </line>
      <div className="Create__date">
        <div>{DAYSWEEK.short[dayWeek]}.,</div>
        <div>{MONTHS.nominative[month]}</div>
        <div>{dateMonth}</div>
        <div className="separator md" />
        <div>
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}
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

      <line className="flex upper-middle" style={{ gap: "12px" }}>
        {ACTIVITIES.map(({ id, name }) => {
          return (
            <div
              key={id}
              className={classNames("btn", {
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
        })}
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

          onClickCreateNote({
            timestamp: {
              date: dateDB,
              time: timeDB,
              dayWeek: dayWeekDB,
            },
            mood: mood,
            activities: Array.from(activities).sort((a, b) => a - b),
            desc: textarea,
          });
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
