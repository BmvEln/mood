import React from "react";
import "./style.less";
import { IMG } from "../../../static.ts";
import classNames from "classnames";

const IMGS = {
  default: undefined,
  blue: undefined,
  "close-1-black": "closeCardBlack",
  "close-2-blue": "closeCardBlue",
  delete: "deleteCard",
  edit: "editCard",
};

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  width?: number | "fit-content";
  // гарантируем, что значение переменной theme будет ключом объекта IMGS
  theme?: keyof typeof IMGS;
  size?: "md" | "big";
  img?: keyof typeof IMGS;
  style?: object;
  className?: string;
};

function Button({
  onClick = () => {},
  children,
  width,
  theme = "default",
  size = "md",
  style,
  className,
}: Props) {
  return (
    <button
      className={classNames("Button", theme, className, size)}
      style={{ width, ...style }}
      onClick={onClick}
    >
      {children}

      {IMGS[theme] ? (
        <img src={IMG[IMGS[theme]]} width={20} height={20} alt="" />
      ) : null}
    </button>
  );
}

export default Button;
