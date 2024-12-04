import React, { ReactNode } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const gteStyles = (variant: string) => {
  if (variant === "primary") {
    return "bg-[#6a3fe5] border-[#6a3fe5 text-white";
  } else if (variant === "secondary") {
    return "bg-white border-[#6a3fe5] text-black";
  } else {
    return "bg-[#6a3fe5] border-[#6a3fe5 text-white";
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  ...rest
}) => {
  return (
    <button
      className={`border px-4 py-2 rounded-md text-center disabled:bg-[#a383ff] ${gteStyles(
        variant as string
      )} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
