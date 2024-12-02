import React, { ReactNode } from "react";

interface HeaderPops {
  actions?: ReactNode;
}

export const Header: React.FC<HeaderPops> = ({ actions }) => {
  return <header className="w-full shadow-lg h-16 p-3 flex justify-between items-center">
    <div>
      <h1 className="font-bold text-lg">Drag and Drop Tiles</h1>
    </div>
    <div>{actions}</div>
  </header>
};