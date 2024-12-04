import React, { useEffect, useState } from "react";
import { Message as MessageType } from "../data";
import { Message } from "./Message";
import DraggableItem from "./DargAndDrop/DraggableItem";
import { DargAndDropProvider } from "./DargAndDrop/DragContext";

interface StackProps {
  date: string;
  messages: MessageType[];
  disabled?: boolean;
  onDragUpdate?: (event: "start" | "end", stack: string | number) => void;
}

export const Stack: React.FC<StackProps> = ({
  date,
  messages,
  disabled,
  onDragUpdate,
}) => {
  const [messageList, setMessageList] = useState(messages);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [liveText, setLiveText] = useState("");

  const onDrop = (draggedIndex: number, dropIndex: number) => {
    const updatedItems = [...messageList];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(dropIndex, 0, draggedItem);
    setMessageList(updatedItems);
  };

  const onDragStart = () => {
    if (onDragUpdate) {
      onDragUpdate("start", date);
    }
  };

  const onDragEnd = () => {
    if (onDragUpdate) {
      onDragUpdate("end", date);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setFocusIndex((prev) => Math.max(0, prev - 1));
        setLiveText(
          `Item ${index + 1}, grabbed. Current position in list: ${Math.max(
            0,
            focusIndex
          )} of ${messageList.length}.`
        );
        break;

      case "ArrowDown":
        e.preventDefault();
        setFocusIndex((prev) => Math.min(messageList.length - 1, prev + 1));
        setLiveText(
          `Item ${index + 1}, grabbed. Current position in list: ${Math.min(
            messageList.length,
            focusIndex + 2
          )} of ${messageList.length}.`
        );
        break;

      case " ":
        e.preventDefault();
        if (focusIndex === -1) {
          // Start dragging
          setFocusIndex(index);
          setLiveText(
            `Item ${index + 1}, grabbed. Current position in list: ${
              index + 1
            } of ${
              messageList.length
            }. Press up and down arrow keys to change position, Spacebar to drop, Escape key to cancel.`
          );
        } else if (focusIndex !== -1) {
          // Drop item
          const newItems = [...messageList];
          const [draggedItem] = newItems.splice(index, 1);
          newItems.splice(focusIndex, 0, draggedItem);
          setMessageList(newItems);
          setFocusIndex(-1);
          setLiveText(
            `Item ${index + 1}, dropped. Final position in list: ${
              focusIndex + 1
            } of 4.`
          );
          setTimeout(() =>  setLiveText(``), 1000);
        }
        break;

      case "Escape":
        e.preventDefault();
        setLiveText(`Reorder cancelled`);
        setTimeout(() =>  setLiveText(``), 1000);
        setFocusIndex(-1); // Cancel drag
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  return (
    <div>
      <div className="w-60 p-3 rounded-md shadow-md border bg-white relative">
        {disabled && (
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30 bg-slate-400 z-20"></div>
        )}
        <label
          id={`rolesList-${date}`}
          htmlFor="listbox"
          className="flex h-16 border-b justify-start items-center mb-3"
        >
          <div className="mr-3">Date:</div>
          <div>{date}</div>
        </label>
        <span id="operation" className="assistive-text">
          Press Spacebar to reorder
        </span>
        <span aria-live="assertive" className="assistive-text">
          {liveText}
        </span>
        <DargAndDropProvider>
          <div
            className="flex flex-col relative gap-3"
            role="listbox"
            aria-labelledby={`rolesList-${date}`}
          >
            {messageList.map((msg, index) => (
              <DraggableItem
                key={index}
                stackId={date}
                index={index}
                onDrop={onDrop}
                dragEnd={onDragEnd}
                dargStart={onDragStart}
                handleKeyDown={handleKeyDown}
                focused={focusIndex === index}
              >
                <Message date={msg.date} message={msg.message} />
              </DraggableItem>
            ))}
          </div>
        </DargAndDropProvider>
      </div>
    </div>
  );
};
