import React, { useRef } from "react";
import "./style.less";

const iconClear = (onChange: Function, inputRef) => (
  <svg
    onClick={() => {
      onChange("");
      inputRef.current?.focus();
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24px"
    height="24px"
  >
    <path d="M 20.496094 2.9921875 A 0.50005 0.50005 0 0 0 20.146484 3.1464844 L 12 11.292969 L 3.8535156 3.1464844 A 0.50005 0.50005 0 0 0 3.4941406 2.9941406 A 0.50005 0.50005 0 0 0 3.1464844 3.8535156 L 11.292969 12 L 3.1464844 20.146484 A 0.50005 0.50005 0 1 0 3.8535156 20.853516 L 12 12.707031 L 20.146484 20.853516 A 0.50005 0.50005 0 1 0 20.853516 20.146484 L 12.707031 12 L 20.853516 3.8535156 A 0.50005 0.50005 0 0 0 20.496094 2.9921875 z" />
  </svg>
);

type Props = {
  value: string;
  onChange: (e: string) => void;
  placeholder?: string;
  type?: string;
  clear?: boolean;
  width?: number;
};

function Input({ placeholder, type, value, onChange, clear, width }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="Input" style={{ width }}>
      <input
        style={{ width }}
        ref={inputRef}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        disabled={false}
      />
      {clear && value !== "" ? iconClear(onChange, inputRef) : null}
    </div>
  );
}

export default Input;
