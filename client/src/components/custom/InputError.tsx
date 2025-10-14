import { cn } from "@/lib/utils";
import React from "react";

type InputErrorProps = {
  message: string | undefined;
  className?: string;
};

const InputError: React.FC<InputErrorProps> = ({ message, className }) => {
  return (
    <p className={cn("text-red-500 text-sm", className)}>{message || ""}</p>
  );
};

export default InputError;
