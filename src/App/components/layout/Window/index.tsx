import "./style.less";
import React from "react";
import classNames from "classnames";
import Button from "../../controls/Button";

type Props = {
  id?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  hideClose?: boolean;
  theme?: string;
  confirm?: string | React.ReactNode;
  noQuestion?: boolean;
  confirmYes?: string;
  confirmNo?: string;
  onClickYes?: () => void;
  isUnderstand?: boolean;
  width?: number;
  height?: number;
};

function Window({
  id,
  open,
  onClose,
  children,
  hideClose = false,
  confirm,
  noQuestion = false,
  confirmYes = "Да",
  confirmNo = "Нет",
  isUnderstand = false,
  onClickYes,
  theme,
  width,
  height,
}: Props) {
  return (
    <div
      id={id}
      className={classNames("Window", theme, {
        active: open,
        confirm: confirm,
      })}
      onClick={onClose}
    >
      <div
        className={classNames("Window__content", { active: open })}
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose ? (
          <div className="Window__close" onClick={onClose} />
        ) : null}

        {!confirm ? null : (
          <>
            {noQuestion ? null : (
              <div className="Window__question">{confirm}</div>
            )}

            {isUnderstand ? null : (
              <div className="Window__btns">
                <Button onClick={onClose} width={60} size="big" theme="green">
                  {confirmNo}
                </Button>
                <Button onClick={onClickYes} width={60} size="big" theme="pink">
                  {confirmYes}
                </Button>
              </div>
            )}

            {!isUnderstand ? null : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button onClick={onClose} size="big" theme="green">
                  Понятно
                </Button>
              </div>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  );
}

export default Window;
