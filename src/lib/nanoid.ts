import { customAlphabet } from "nanoid";

export const createId = () => customAlphabet("abcdef0123456789", 12)();
