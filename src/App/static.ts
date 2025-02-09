// Импорт картинок
import s02 from "../static/svg/smiles/s02.svg";
import s04 from "../static/svg/smiles/s04.svg";
import s06 from "../static/svg/smiles/s06.svg";
import s08 from "../static/svg/smiles/s08.svg";
import s10 from "../static/svg/smiles/s10.svg";
import deleteCard from "../static/svg/deleteCard.svg";
import editCard from "../static/svg/editCard.svg";
import closeCardBlue from "../static/svg/closeCardBlue.svg";
import closeCardBlack from "../static/svg/closeCardBlack.svg";
import box from "../static/svg/box.svg";

export const IMG = {
  s02,
  s04,
  s06,
  s08,
  s10,
  deleteCard,
  editCard,
  closeCardBlue,
  closeCardBlack,
  box,
};

export const LINK_SING_IN = "singIn";
export const LINK_SING_UP = "singUp";
export const LINK_NOTES = "notes";
export const LINK_HOME = ".";
export const NOTES_ORDER_DEC = "decrease";
export const NOTES_ORDER_INC = "increase";

export const MOODS: {
    id: number;
    name: string;
    color: string;
    img: string;
  }[] = [
    { id: 1, name: "Ужасно", color: "#e9faff", img: "s02" },
    { id: 2, name: "Плохо", color: "#bde4e4", img: "s04" },
    { id: 3, name: "Нормально", color: "#87dddd", img: "s06" },
    { id: 4, name: "Хорошо", color: "#65c9c9", img: "s08" },
    { id: 5, name: "Супер", color: "#30a8a8", img: "s10" },
  ],
  ACTIVITIES: { id: number; name: string }[] = [
    { id: 1, name: "Работа" },
    { id: 2, name: "Отдых" },
    { id: 3, name: "Друзья" },
    { id: 4, name: "Свидание" },
    { id: 5, name: "Спорт" },
    { id: 6, name: "Вечеринка" },
    { id: 7, name: "Кино" },
    { id: 8, name: "Чтение" },
    { id: 9, name: "Игры" },
    { id: 10, name: "Покупки" },
    { id: 11, name: "Вкусная еда" },
    { id: 12, name: "Уборка" },
  ],
  MONTHS: { genitive: string[]; nominative: string[]; short: string[] } = {
    genitive: [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ],
    nominative: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    short: [
      "Янв.",
      "Фев.",
      "Март",
      "Апр.",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сент.",
      "Окт.",
      "Нояб.",
      "Дек.",
    ],
  },
  DAYSWEEK: { full: string[]; short: string[] } = {
    full: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  };
