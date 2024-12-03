import React, {
  createContext,
  Dispatch,
  DragEventHandler,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface DargAndDropProviderProps {
  children: ReactNode;
}

export interface DragItemProps {
  draggingIndex: number;
  stackId: string | number | null;
  isDragging?: boolean;
  currentTarget?: number;
  dargDirection?: "up" | "down" | null;
}

export interface DragContextProps {
  dragItem: DragItemProps;
  setDragItem: Dispatch<SetStateAction<DragItemProps>>;
}

const initialState = {
  draggingIndex: -1,
  isDragging: false,
  currentTarget: -1,
  dargDirection: null,
  stackId: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const DragContext = createContext<DragContextProps>({
  dragItem: { ...initialState },
  setDragItem: () => {},
});

export const DargAndDropProvider: React.FC<DargAndDropProviderProps> = ({
  children,
}) => {
  const [dragItem, setDragItem] = useState<DragItemProps>({ ...initialState });

  /**
   * On drag to bottom or top the scroll section should scroll
   * @param e Drag Event
   * @returns void
   */
  const dragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const container = document.getElementById("main-scroll-area");
    if (!container) return;

    const { clientHeight, scrollTop, scrollHeight } = container;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to container
    const offsetY = e.clientY - rect.top;

    const scrollSpeed = 10; // Pixels per frame
    const edgeThreshold = 50; // Pixels near the edge to trigger scrolling

    // Scroll down if near the bottom edge
    if (offsetY > clientHeight - edgeThreshold && scrollTop + clientHeight < scrollHeight) {
      container.scrollTop += scrollSpeed;
    }

    // Scroll up if near the top edge
    if (offsetY < edgeThreshold && scrollTop > 0) {
      container.scrollTop -= scrollSpeed;
    }
  };

  return (
    <DragContext.Provider value={{ dragItem, setDragItem }}>
      <div
        onDragOver={dragOver}
      >
        {children}
      </div>
    </DragContext.Provider>
  );
};
