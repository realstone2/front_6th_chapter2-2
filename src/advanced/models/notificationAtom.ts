import { atom } from "jotai";
import { Notification } from "./notification";

export const notificationsAtom = atom<Notification[]>([]);
