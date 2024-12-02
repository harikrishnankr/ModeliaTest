import React, { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, headerActions }) => {
  return (
    <>
      <Header actions={headerActions} />
      <main className="w-full overflow-auto h-[calc(100%-4rem)]">
        {children}
      </main>
    </>
  );
};
