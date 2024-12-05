import React, { useRef, useEffect, ReactNode, useState } from "react";
import { useDragContext } from "./useDragContext";

interface DraggableItemProps {
  children: ReactNode;
  index: number;
  onDrop: (e: number, k: number) => void;
  stackId?: number | string | null;
  dargStart?: () => void;
  dragEnd?: () => void;
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => void;
  focused?: boolean;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  children,
  index,
  onDrop,
  stackId,
  dargStart,
  dragEnd,
  handleKeyDown,
  focused,
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
    const handleDragStart = (e: DragEvent) => {
      if (element) {
        setDragItem({
          draggingIndex: index,
          stackId: stackId as string,
          dragItemHeight: (e as unknown as React.DragEvent).currentTarget?.clientHeight
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
          dragItemHeight: 0
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
  }, [
    dragItem,
    index,
    onDrop,
    setDragItem,
    placeholderPos,
    stackId,
    lastY,
    dargStart,
    dragEnd,
    ref
  ]);

  const dropOnPlaceHolder = () => {
    /**
     * Wrapped the function in a requestAnimationFrame
     * So that the animation and tile rearrangement 
     * matched with the device refresh rate and called before repaint
     */
    requestAnimationFrame(() => {
      if (dragItem.draggingIndex === -1) {
        return;
      }
      setPlaceHolderPos("");
      const draggedIndex = dragItem.draggingIndex.toString();
      if (draggedIndex === index.toString()) {
        return;
      }
      setDragItem({ ...dragItem, isDragging: false, stackId: null });
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
      } else if (
      /**
       * Dragged from bottom to top
       */
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
    });
  };

  return (
    <button
      className={`flex flex-col gap-3 ${
        dragItem.isDragging && dragItem.draggingIndex === index ? "hidden" : ""
      } ${focused ? "border border-[#6a3fe5] border-dashed" : ""}`}
      role="option"
      aria-describedby="operation"
      onKeyDown={(e) => handleKeyDown && handleKeyDown(e, index)}
    >
      {dragItem.currentTarget === index && dragItem.dargDirection === "up" && (
        <div
          className={`h-[86px] bg-[#e7f3ff] w-full rounded border border-dashed border-[#a1a1a1]`}
          onDrop={dropOnPlaceHolder}
          style={{ height: dragItem.dragItemHeight || 'auto' }}
        ></div>
      )}
      <div className="w-full" ref={ref} draggable="true">
        {children}
      </div>
      {dragItem.currentTarget === index &&
        dragItem.dargDirection === "down" && (
          <div
            className={`h-[86px] w-full bg-[#e7f3ff] rounded border border-dashed border-[#a1a1a1]`}
            onDrop={dropOnPlaceHolder}
            style={{ height: dragItem.dragItemHeight || 'auto' }}
          ></div>
        )}
    </button>
  );
};

export default DraggableItem;
