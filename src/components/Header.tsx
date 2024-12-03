import React, { ReactNode } from "react";

interface HeaderPops {
  actions?: ReactNode;
}

export const Header: React.FC<HeaderPops> = ({ actions }) => {
  return <header className="w-full shadow-lg h-16 p-3 flex justify-between items-center">
    <div>
      <h1 className="font-bold text-lg">
        <span className="md:hidden">DnD Tiles</span>
        <span className="hidden md:inline-block">Drag and Drop Tiles</span>
      </h1>
    </div>
    <div>{actions}</div>
  </header>
};