export type Creds = { idInstance: string; apiTokenInstance: string }

const API_URL = import.meta.env.VITE_API_URL
const url = ({ idInstance, apiTokenInstance }: Creds, method: string, tail = '') =>
  `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}${tail}`

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  return res.json()
}

export const getStateInstance = (c: Creds) =>
  request<{ stateInstance: string }>(url(c, 'getStateInstance'))

export const sendMessage = (c: Creds, phone: string, message: string) =>
  request<{ idMessage: string }>(url(c, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId: `${phone}@c.us`, message }),
  })

export type Notification = {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage?: string
    timestamp: number
    senderData?: { senderPhoneNumber?: number }
    messageData?: {
      typeMessage: string
      textMessageData?: { textMessage: string }
      extendedTextMessageData?: { text: string }
    }
  }
}

export const receiveNotification = (c: Creds, signal: AbortSignal) =>
  request<Notification | null>(url(c, 'receiveNotification', '?receiveTimeout=20'), { signal })

export const deleteNotification = (c: Creds, receiptId: number, signal?: AbortSignal) =>
  request<{ result: boolean }>(url(c, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
    signal,
  })