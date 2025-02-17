import { useCallback, useEffect, useRef, useState } from "react";
import "./style.less";

type SelectProps = {
  variants: { id: number; name: string }[];
  onChange?: (value: number | undefined) => void;
};

function Select({ variants = [{ id: 1, name: "" }], onChange }: SelectProps) {
  const [activePopUp, setActivePopUp] = useState(false);
  const [idxItem, setIdxItem] = useState<number | undefined>(undefined);
  const refSelect = useRef(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (refSelect.current && !refSelect.current.contains(e.target)) {
      setActivePopUp(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div className="Select" ref={refSelect}>
      <div
        className="Select__header"
        onClick={() => setActivePopUp(!activePopUp)}
      >
        {typeof idxItem === "number" ? (
          variants[idxItem].name
        ) : (
          <span className="Select__notDefined">Не выбрано</span>
        )}
      </div>
      <div
        className="Select__popUp"
        style={{
          opacity: activePopUp ? 1 : 0,
          maxHeight: activePopUp ? "250px" : 0,
          pointerEvents: activePopUp ? "auto" : "none",
        }}
      >
        {variants.map(({ id, name }, i) => {
          const item = (
            <div
              onClick={() => {
                setIdxItem(i);
                setActivePopUp(false);
                // Должен возвращать id?
                onChange(id);
              }}
              className="Select__point"
            >
              <div>{name}</div>
            </div>
          );

          return (
            <>
              {i === 0 ? (
                <>
                  {/* Добавляем всегда в начале вариант не выбрано */}
                  <div
                    className="Select__point"
                    style={{ pointerEvents: activePopUp ? "auto" : "none" }}
                    onClick={() => {
                      setIdxItem(undefined);
                      setActivePopUp(false);
                      onChange(undefined);
                    }}
                  >
                    <div>Не выбрано</div>
                  </div>
                  {item}
                </>
              ) : (
                item
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Select;
