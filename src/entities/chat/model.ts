import { create } from 'zustand'

export type Message = { id: string; text: string; out: boolean; ts: number }

type ChatsState = {
  chats: Record<string, Message[]>
  active: string | null
  openChat: (phone: string) => void
  addMessage: (phone: string, msg: Message) => void
  reset: () => void
}

export const useChats = create<ChatsState>((set) => ({
  chats: {},
  active: null,
  openChat: (phone) =>
    set((s) => ({ active: phone, chats: { [phone]: [], ...s.chats } })),
  addMessage: (phone, msg) =>
    set((s) => {
      const list = s.chats[phone] ?? []
      if (list.some((m) => m.id === msg.id)) return s
      return { chats: { ...s.chats, [phone]: [...list, msg] } }
    }),
  reset: () => set({ chats: {}, active: null }),
}))