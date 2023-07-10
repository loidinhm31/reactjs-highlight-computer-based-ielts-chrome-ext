export interface Position {
    left?: number;
    top?: number;
}

export interface Note {
    pos?: Position;
    text: string;
}

export interface HighlightedRegion {
    id: number;
    note?: Note;
}

export interface ContextMenu {
    mode?: string;
    pos?: { top?: number; left?: number };
}
