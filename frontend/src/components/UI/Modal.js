import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.css"

export default function Modal({ open, title, message, actions, onClose }) {
  const dialog = useRef();
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog ref={dialog} className={classes.modal} onClose={onClose}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={classes.actions}>{actions}</div>
    </dialog>,
    document.getElementById("modal")
  );
}