import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Message = { id: string; text: string; out: boolean; ts: number }
export type Contact = { name: string; avatar: string }

type ChatsState = {
  owner: string | null
  chats: Record<string, Message[]>
  contacts: Record<string, Contact>
  active: string | null
  ensureOwner: (idInstance: string) => void
  openChat: (phone: string) => void
  addMessage: (phone: string, msg: Message) => void
  setContact: (phone: string, contact: Contact) => void
  closeChat: () => void
}

export const useChats = create<ChatsState>()(
  persist(
    (set) => ({
      owner: null,
      chats: {},
      contacts: {},
      active: null,
      ensureOwner: (idInstance) =>
        set((s) =>
          s.owner === idInstance
            ? s
            : { owner: idInstance, chats: {}, contacts: {}, active: null },
        ),
      openChat: (phone) =>
        set((s) => ({ active: phone, chats: { [phone]: [], ...s.chats } })),
      closeChat: () => set({ active: null }),
      addMessage: (phone, msg) =>
        set((s) => {
          const list = s.chats[phone] ?? []
          if (list.some((m) => m.id === msg.id)) return s
          return { chats: { ...s.chats, [phone]: [...list, msg] } }
        }),
      setContact: (phone, contact) =>
        set((s) => ({ contacts: { ...s.contacts, [phone]: contact } })),
    }),
    {
      name: 'chats',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ owner, chats, contacts }) => ({ owner, chats, contacts }),
    },
  ),
)