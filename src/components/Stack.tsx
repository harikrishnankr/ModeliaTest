import React, { useEffect, useState } from "react";
import { Message as MessageType } from "../data";
import { Message } from "./Message";
import DraggableItem from "./DargAndDrop/DraggableItem";
import { DargAndDropProvider, } from "./DargAndDrop/DragContext";

interface StackProps {
  date: string;
  messages: MessageType[];
  disabled?: boolean;
  onDragUpdate?: (event: "start" | "end", stack: string | number ) => void;
}

export const Stack: React.FC<StackProps> = ({ date, messages, disabled, onDragUpdate }) => {
  const [messageList, setMessageList] = useState(messages);

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

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  return (
    <div>
      <div className="w-60 p-3 rounded-md shadow-md border bg-white relative">
        {disabled && <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30 bg-slate-400 z-20"></div>}
        <div className="flex h-16 border-b justify-start items-center mb-3">
          <div className="mr-3">Date:</div>
          <div>{date}</div>
        </div>
        <DargAndDropProvider>
          <div className="flex flex-col relative gap-3">
            {messageList.map((msg, index) => (
              <DraggableItem
                key={index}
                stackId={date}
                index={index}
                onDrop={onDrop}
                dragEnd={onDragEnd}
                dargStart={onDragStart}
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
