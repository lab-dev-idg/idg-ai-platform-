import { ku } from "./ku";
import { ar } from "./ar";

export const translations = {
  ku,
  ar,
};

export type Language = keyof typeof translations;
