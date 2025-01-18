import { MONTHS } from "../static.ts";

/**
 *
 * @param {string} date - например: "01.01.2025"
 */
export function getMonthCreateNote(date: string, format = "short") {
  return MONTHS[`${format}`][Number(date.slice(3, 5).replace("0", "")) - 1];
}

/**
 *
 * @param {string} date - например: "01.01.2025"
 */
export function getYearCreateNote(date: string) {
  return date.slice(6);
}

/**
 *
 * @param {string} date - например: "01.01.2025"
 */
export function getDayCreateNote(date: string) {
  return date.slice(0, 2).replace("0", "");
}

export function areArraysEqual(
  arr1: (number | string)[],
  arr2: (number | string)[],
) {
  if (
    arr1.length &&
    arr2.length &&
    arr1.every((e, i: number) => e === arr2[i])
  ) {
    return true;
  }

  return false;
}
