import React, { useRef, useEffect, ReactNode, useState } from "react";
import { useDragContext } from "./useDragContext";

interface DraggableItemProps {
  children: ReactNode;
  index: number;
  onDrop: (e: number, k: number) => void;
  stackId?: number | string | null;
  dargStart?: () => void;
  dragEnd?: () => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  children,
  index,
  onDrop,
  stackId,
  dargStart,
  dragEnd
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { dragItem, setDragItem } = useDragContext();
  const [placeholderPos, setPlaceHolderPos] = useState("");
  const [lastY, setLastY] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (dragItem.currentTarget !== index) {
      setPlaceHolderPos("");
    }

    /**
     * Keep track of the drag item
     */
    const handleDragStart = () => {
      if (element) {
        setDragItem({
          draggingIndex: index,
          stackId: stackId as string,
        });
        element.style.opacity = "0.6";
        if (dargStart) {
          dargStart();
        }
      }
    };

    /**
     * Remove all drag context data
     */
    const handleDragEnd = () => {
      if (element) {
        element.style.opacity = "1";
        setDragItem({
          ...dragItem,
          draggingIndex: -1,
          currentTarget: -1,
          dargDirection: null,
          isDragging: false,
          stackId: null,
        });
        setPlaceHolderPos("");
        setLastY(null);
        if (dragEnd) {
          dragEnd();
        }
      }
    };

    const handleDragEnter = (e: DragEvent) => {
      /**
       * Check the drag direction is to top or down
       * Store the previous Y-Index
       * If the previous Y-Index > current Y-Index then dragging up
       * else dragging down
       */
      const currentY = e.clientY; // Current Y position of the pointer
      if (lastY !== null) {
        if (currentY > lastY) {
          setDragItem({ ...dragItem, dargDirection: "down" });
        } else if (currentY < lastY) {
          setDragItem({ ...dragItem, dargDirection: "up" });
        }
      }
      setLastY(currentY);

      const draggedIndex = dragItem.draggingIndex.toString();
      /**
       * preventDefault to skip the multiple drag enter event
       */
      e.preventDefault();

      /**
       * If the dragged over another item
       */
      if (!element?.contains(e.relatedTarget as Node)) {
        if (draggedIndex !== index.toString()) {
          setDragItem({ ...dragItem, isDragging: true, currentTarget: index });
          if (placeholderPos === "up") {
            setPlaceHolderPos("down");
          } else if (placeholderPos === "down") {
            setPlaceHolderPos("up");
          } else {
            if (parseInt(draggedIndex) < index) {
              setPlaceHolderPos("down");
            } else {
              setPlaceHolderPos("up");
            }
          }
        }
      }
    };

    if (element) {
      element.addEventListener("dragstart", handleDragStart);
      element.addEventListener("dragend", handleDragEnd);
      element.addEventListener("dragenter", handleDragEnter);
    }

    return () => {
      if (element) {
        element.removeEventListener("dragstart", handleDragStart);
        element.removeEventListener("dragend", handleDragEnd);
        element.removeEventListener("dragenter", handleDragEnter);
      }
    };
  }, [dragItem, index, onDrop, setDragItem, placeholderPos, stackId, lastY, dargStart, dragEnd]);

  const dropOnPlaceHolder = () => {
    if (dragItem.draggingIndex === -1) {
      return;
    }
    const draggedIndex = dragItem.draggingIndex.toString();
    if (draggedIndex === index.toString()) {
      return;
    }
    setDragItem({ ...dragItem, isDragging: false, stackId: null });
    setPlaceHolderPos("");
    let targetIndex = -1;
    /**
     * Dragged from top to bottom
     */
    if (
      parseInt(draggedIndex) < index &&
      (dragItem.currentTarget || dragItem.currentTarget === 0)
    ) {
      targetIndex =
        dragItem.dargDirection === "up"
          ? dragItem.currentTarget - 1
          : dragItem.currentTarget;
    } 
    /**
     * Dragged from bottom to top
     */
    else if (
      parseInt(draggedIndex) > index &&
      (dragItem.currentTarget || dragItem.currentTarget === 0)
    ) {
      targetIndex =
        dragItem.dargDirection === "down"
          ? dragItem.currentTarget + 1
          : dragItem.currentTarget;
    }
    onDrop(parseInt(draggedIndex as string, 10), targetIndex);
    if (dragEnd) {
      dragEnd();
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 ${
        dragItem.isDragging && dragItem.draggingIndex === index ? "hidden" : ""
      }`}
    >
      {dragItem.currentTarget === index && dragItem.dargDirection === "up" && (
        <div
          className={`h-[86px] bg-[#e7f3ff] rounded border border-dashed border-[#a1a1a1]`}
          onDrop={dropOnPlaceHolder}
        ></div>
      )}
      <div ref={ref} draggable="true">
        {children}
      </div>
      {dragItem.currentTarget === index &&
        dragItem.dargDirection === "down" && (
          <div
            className={`h-[86px] bg-[#e7f3ff] rounded border border-dashed border-[#a1a1a1]`}
            onDrop={dropOnPlaceHolder}
          ></div>
        )}
    </div>
  );
};

export default DraggableItem;
