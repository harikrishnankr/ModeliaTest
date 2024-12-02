import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
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

  return (
    <DragContext.Provider value={{ dragItem, setDragItem }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </div>
    </DragContext.Provider>
  );
};
