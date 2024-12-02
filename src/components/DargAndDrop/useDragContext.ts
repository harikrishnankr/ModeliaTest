import { useContext } from "react";
import { DragContext, DragContextProps } from "./DragContext";

export const useDragContext = (): DragContextProps => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useExampleContext must be used within an ExampleProvider");
  }
  return context;
};