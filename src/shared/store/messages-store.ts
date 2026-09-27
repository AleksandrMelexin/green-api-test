import { create } from "zustand";

type usersStore = {
    message: string;
};

export const useMessagesStore = create<usersStore>()(() => ({
    message: 'hello world',
}));