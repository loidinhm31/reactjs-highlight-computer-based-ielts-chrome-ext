import React, { useEffect, useState } from "react";
import "./HighlightNotes.scss";
import { ContextMenu, HighlightedRegion, Note } from "../../type/highlight";

export default function HighlightNotes(props: any) {
  const [noteVisibleId, setNoteVisibleId] = useState<number[]>([]);
  const [noteDragging, setNoteDragging] = useState<Note | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ mode: "", pos: {} });
  const [mouseClickPos, setMouseClickPos] = useState<{ offsetX?: number; offsetY?: number }>({});
  const [highlightedRegionClickedId, setHighlightedRegionClickedId] = useState<string>("");
  const [highlightedRegionsCounter, setHighlightedRegionsCounter] = useState<number>(0);
  const [highlightedRegions, setHighlightedRegions] = useState<HighlightedRegion[]>([]);

  useEffect(() => {
    addListenerLeftClick();
    addListenerRightClick();
  }, []);

  useEffect(() => {
    if (props.testPageNumber !== highlightedRegionsCounter) {
      resetState();
    }
  }, [props.testPageNumber]);

  const getInitialState = (): {
    noteVisibleId: number[];
    noteDragging: Note | undefined;
    contextMenu: ContextMenu;
    mouseClickPos: { offsetX?: number; offsetY?: number };
    highlightedRegionClickedId: string;
    highlightedRegionsCounter: number;
    highlightedRegions: HighlightedRegion[];
  } => {
    return {
      noteVisibleId: [],
      noteDragging: undefined,
      contextMenu: {
        mode: "",
        pos: {}
      },
      mouseClickPos: {},
      highlightedRegionClickedId: "",
      highlightedRegionsCounter: 0,
      highlightedRegions: []
    };
  };

  const resetState = (): void => {
    const initialState = getInitialState();
    setNoteVisibleId(initialState.noteVisibleId);
    setNoteDragging(initialState.noteDragging);
    setContextMenu(initialState.contextMenu);
    setMouseClickPos(initialState.mouseClickPos);
    setHighlightedRegionClickedId(initialState.highlightedRegionClickedId);
    setHighlightedRegionsCounter(initialState.highlightedRegionsCounter);
    setHighlightedRegions(initialState.highlightedRegions);
  };

  const leftClickAction = (event: MouseEvent): void => {
    const selection = window.getSelection();

    if (selection) {
      const selected = selection.getRangeAt(0);
      const parentEl = selected.commonAncestorContainer?.parentNode as HTMLElement;
      if (parentEl?.classList.contains("isnote")) {
        const id = parentEl.getAttribute("data-highlightedregion-id");
        const idExisting = noteVisibleId.includes(parseInt(id!));
        if (!idExisting) {
          setNoteVisibleId((prevState) => [...prevState, parseInt(id!)]);
        }
      }
    }
  };

  const addListenerLeftClick = (): void => {
    const el = document.body as HTMLElement;

    if (el) {
      el.addEventListener("click", leftClickAction);
    }
  };

  const rightClickAction = (event: MouseEvent): void => {
    event.preventDefault();
    const selection = window.getSelection();

    if (selection?.rangeCount! > 0) {
      const range = selection?.getRangeAt(0);
      const endContainer: any = range?.endContainer;
      const startContainer: any = range?.startContainer;

      if (endContainer?.wholeText === startContainer?.wholeText) {
        const selectedText = range?.toString();
        const contextMenuData: ContextMenu = {
          mode: "",
          pos: {
            top: event.clientY,
            left: event.clientX
          }
        };

        const highlightedRegionClickedId = getHighlightIdFromParents(range?.commonAncestorContainer?.parentNode!);
        if (highlightedRegionClickedId !== "") {
          contextMenuData.mode = "existing";
        } else if (selectedText !== "") {
          contextMenuData.mode = "new";
        }
        setContextMenu(contextMenuData);
        setHighlightedRegionClickedId(highlightedRegionClickedId);
      }
    }
  };

  const addListenerRightClick = (): void => {
    const el = document.body as HTMLElement;

    if (el) {
      el.addEventListener("contextmenu", rightClickAction, false);
    }
  };

  const getHighlightIdFromParents = (elem: any): string => {
    if (
      elem.nodeType === 1 &&
      !elem.classList.contains("content") &&
      !elem.classList.contains("title") &&
      !elem.classList.contains("App")
    ) {
      if (elem.classList.contains("highlight")) {
        return elem.getAttribute("data-highlightedregion-id")!;
      } else if (elem.parentNode) {
        return getHighlightIdFromParents(elem.parentNode);
      }
    }
    return "";
  };

  const dragNote_Start = (event: React.MouseEvent, note: Note): void => {
    const mouseClickPosData = {
      offsetX: event.clientX - note.pos!.left!,
      offsetY: event.clientY - note.pos!.top!
    };
    setMouseClickPos(mouseClickPosData);
    setNoteDragging(note);
  };

  const dragNote_Stop = (event: React.MouseEvent): void => {
    setNoteDragging(undefined);
  };

  const dragNote_Move = (event: React.MouseEvent): void => {
    if (noteDragging) {
      const noteDraggingData: Note = {
        ...noteDragging,
        pos: {
          left: event.clientX - (mouseClickPos.offsetX || 0),
          top: event.clientY - (mouseClickPos.offsetY || 0)
        }
      };
      setNoteDragging(noteDraggingData);
    }
  };

  const handleNoteClose = (event: React.MouseEvent, noteId: number): void => {
    const filteredNoteVisibleId = noteVisibleId.filter((VisibleId) => VisibleId !== noteId);
    setNoteVisibleId(filteredNoteVisibleId);
  };

  const handleNoteContentChange = (event: React.FormEvent<HTMLDivElement>, note: Note): void => {
    const updatedNote: Note = { ...note, text: event.currentTarget.innerText };

    setNoteDragging(updatedNote);
  };

  const handleContextMenuItemClick_Clear = (event: React.MouseEvent, clearAll?: boolean): void => {
    let updatedHighlightedRegions = [...highlightedRegions];
    if (clearAll) {
      updatedHighlightedRegions = [];
      const nodes = document.querySelectorAll(".highlight");
      nodes.forEach((node) => {
        clearHighlight(node.getAttribute("data-highlightedregion-id")!);
      });
      setNoteVisibleId([]);
    } else {
      const filteredHighlightedRegions = updatedHighlightedRegions.filter((highlightedRegion) => {
        return highlightedRegion.id.toString() !== highlightedRegionClickedId;
      });

      clearHighlight(highlightedRegionClickedId);
      setHighlightedRegions(filteredHighlightedRegions);
      setNoteVisibleId((prevState) =>
        prevState.filter((visibleId) => visibleId !== Number(highlightedRegionClickedId))
      );
    }
    setContextMenu({ mode: "" });
  };

  const handleContextMenuItemClick_Highlight = (event: React.MouseEvent): void => {
    createNewHighlightFromSelection(event);
  };

  const handleContextMenuItemClick_Note = (event: React.MouseEvent): void => {
    if (highlightedRegionClickedId === "") {
      createNewHighlightFromSelection(event, true);
    } else {
      const node = document.querySelectorAll(
        `.highlight[data-highlightedregion-id='${highlightedRegionClickedId}']`
      )[0] as HTMLElement;
      node.classList.add("isnote");
      const idExisting = noteVisibleId.includes(Number(highlightedRegionClickedId));
      if (!idExisting) {
        setNoteVisibleId((prevState) => [...prevState, Number(highlightedRegionClickedId)]);
      }
      setContextMenu({ mode: "" });
    }
  };

  const createNewHighlightFromSelection = (event: React.MouseEvent, isNote?: boolean): void => {
    const highlightedRegionsCounterData = highlightedRegionsCounter + 1;
    setHighlightedRegionsCounter(highlightedRegionsCounterData);

    const selection = window.getSelection()?.getRangeAt(0);
    const selectedText = selection?.extractContents();
    const span = document.createElement("span");
    span.classList.add("highlight");
    if (isNote) {
      span.classList.add("isnote");
    }
    span.setAttribute("data-highlightedregion-id", highlightedRegionsCounterData.toString());
    span.appendChild(selectedText!);
    selection?.insertNode(span);

    // add it to the array so we can keep track of them.
    const newHighlightedRegion: HighlightedRegion = {
      id: highlightedRegionsCounterData,
      note: isNote ? { pos: contextMenu.pos, text: "" } : undefined
    };

    setHighlightedRegions((prevState) => [...prevState, newHighlightedRegion]);

    window.getSelection()?.removeAllRanges();

    const idExisting = noteVisibleId.includes(highlightedRegionsCounterData);
    if (!idExisting) {
      setNoteVisibleId((prevState) => [...prevState, highlightedRegionsCounterData]);
    }

    setContextMenu({ mode: "" });
  };

  const clearHighlight = (id: string): void => {
    const el = document.querySelectorAll(`.highlight[data-highlightedregion-id='${id}']`)[0] as HTMLElement;
    const parent = el.parentNode!;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  };

  const handleClickOutside = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      setContextMenu({ mode: "" });
    }
  };

  const renderNotes = (): JSX.Element => {
    return (
      <div className="notes-container">
        {highlightedRegions.map((highlightedRegion) => {
          if (highlightedRegion.note) {
            const noteVisible = noteVisibleId.includes(highlightedRegion.id) ? "visible" : "";
            return (
              <div className={`note ${noteVisible}`} key={highlightedRegion.id} style={highlightedRegion.note.pos}>
                <div className="close" onClick={(event) => handleNoteClose(event, highlightedRegion.id)}></div>
                <div
                  className="draghandle"
                  onMouseDown={(event) => dragNote_Start(event, highlightedRegion.note!)}
                ></div>
                <div className="edit">
                  <div
                    className="mainText"
                    contentEditable={true}
                    spellCheck="false"
                    onInput={(event) => handleNoteContentChange(event, highlightedRegion.note!)}
                  ></div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  let cssClass = "";
  if (noteVisibleId.length > 0 || contextMenu.mode !== "") {
    cssClass += "visible ";
  }

  let contextMenuClearMode = "";
  if (contextMenu.mode === "existing" && highlightedRegions.length > 0) {
    contextMenuClearMode = highlightedRegions.length > 1 ? "clear-all" : "clear-single";
  }

  return (
    <div
      className={`highlight-notes-container ${cssClass}`}
      onMouseDown={(event) => handleClickOutside(event)}
      onMouseUp={(event) => dragNote_Stop(event)}
      onMouseMove={(event) => dragNote_Move(event)}
    >
      <ul className={`context-menu-list mode-${contextMenu.mode} ${contextMenuClearMode}`} style={contextMenu.pos}>
        <li
          className="context-menu-item icon-highlight"
          onClick={(event) => handleContextMenuItemClick_Highlight(event)}
        >
          <span>Highlight</span>
        </li>
        <li className="context-menu-item icon-note" onClick={(event) => handleContextMenuItemClick_Note(event)}>
          <span>Notes</span>
        </li>
        <li
          className="context-menu-item icon-clear"
          onClick={(event) => handleContextMenuItemClick_Clear(event)}
          title="Clears this highlighting"
        >
          <span>Clear</span>
        </li>
        <li
          className="context-menu-item icon-clearAll"
          onClick={(event) => handleContextMenuItemClick_Clear(event, true)}
          title="Clears all highlighting on this page"
        >
          <span>Clear all</span>
        </li>
      </ul>
      {renderNotes()}
    </div>
  );
}
