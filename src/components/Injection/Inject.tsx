import "./Inject.scss";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect } from "react";
import HighlightNotes from "../HighlightNote/HighlightNotes";
import ControlPlayer from "../ControlPlayer/ControlPlayer";

interface AppProps {
  enabled: boolean;
}

function Inject({ enabled }: AppProps) {

  useEffect(() => {
    if (enabled) {
      toast.info("Highlight state was on");
    }
  }, [enabled]);

  return (
    <>
      <ToastContainer />

      <ControlPlayer />

      {enabled &&
        <HighlightNotes testPageNumber={1} />
      }
    </>
  );
}

export default Inject;
