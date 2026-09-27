import type { Creds } from '@/shared/api/green-api'
import { getContactInfo } from '@/shared/api/green-api'
import { useChats } from '@/entities/chat/model'

export async function loadContact(creds: Creds, phone: string) {
  const { contacts, setContact } = useChats.getState()
  if (contacts[phone]) return

  try {
    const info = await getContactInfo(creds, phone)
    setContact(phone, { name: info.contactName || info.name, avatar: info.avatar })
  } catch {
    setContact(phone, { name: '', avatar: '' })
  }
}