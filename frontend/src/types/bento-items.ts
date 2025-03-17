import { ReactNode } from "react";

export type BentoItem = {
  title: string;
  description: string;
  imageUrl: string;
  className: string;
  form: ReactNode;
  isAllowed: boolean;
};
