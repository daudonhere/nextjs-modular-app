
import { JSX } from "react";

export interface MenuItemTypes {
  name: string;
  path: string;
  icon: JSX.Element;
  action?: () => void;
}