import React from "react";

interface MessageProps {
  date: string;
  message: string;
}

export const Message: React.FC<MessageProps> = ({ date, message }) => {
  return (
    <div className="border rounded p-3 cursor-pointer bg-white">
      <div className="flex flex-col mb-3 justify-start">
        <div className="font-semibold text-left">Date:</div>
        <div className="text-left">{date}</div>
      </div>
      <div className="flex flex-col justify-start">
        <div className="font-semibold text-left">Message:</div>
        <div className="break-all text-left">{message}</div>
      </div>
    </div>
  )
};