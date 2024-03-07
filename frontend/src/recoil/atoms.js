import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: "",
});

export const selectedChatState = atom({
  key: "selectedChatState",
  default: "",
});
export const chatState = atom({
  key: "chatState",
  default: [],
});

export const notificationState = atom({
  key: "notificationState",
  default: [],
});
