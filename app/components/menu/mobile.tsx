"use client";

import MenuIcon from "../icons/menu";
import Panel from "./panel";
import { useState, useEffect } from "react";

export default function Mobile({ theme }: any) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const close = () => {
      setShow(false);
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <>
      <button
        className="button"
        onClick={(ev) => {
          setShow(true);
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
        }}
      >
        <MenuIcon theme={theme} />
      </button>
      <Panel show={show} />
    </>
  );
}
