import "./style.less";
import classNames from "classnames";
import React from "react";

interface Props {
  className?: string;
  style?: object;
  children?: React.ReactNode;
}

function Page({ children, style, className }: Props) {
  return (
    <div id="page" className={classNames("Page", className)} style={style}>
      <div className="Page__content">{children}</div>

      <div id="pageFooter" className="Page__footer">
        Footer
      </div>
    </div>
  );
}

export default Page;
