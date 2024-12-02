import React from "react";

interface MessageProps {
  date: string;
  message: string;
}

export const Message: React.FC<MessageProps> = ({ date, message }) => {
  return (
    <div className="border rounded p-3 cursor-pointer bg-white">
      <div className="flex mb-3">
        <span className="inline-block mr-3">Date:</span>
        <span>{date}</span>
      </div>
      <div className="flex">
        <span className="inline-block mr-3">Message:</span>
        <span>{message}</span>
      </div>
    </div>
  )
};