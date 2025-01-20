import FlipPanel from "@/app/sections/home/laptop/panels/flip";
import { AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onSuccess: () => void;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onHide, onSuccess }: Props) {
  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {show && (
        <FlipPanel
          token={token}
          onClose={onHide}
          onSuccess={onSuccess}
          from="button"
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
