import { useEffect } from 'react'
import { useAuth } from '@/entities/session/model'
import { useChats } from '@/entities/chat/model'
import {
  receiveNotification,
  deleteNotification,
  type Notification,
  type Creds,
} from '@/shared/api/green-api'
import { loadContact } from '@/shared/lib/load-contact'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function handle({ body }: Notification, creds: Creds) {
  if (body.typeWebhook !== 'incomingMessageReceived') return
  const d = body.messageData
  const text = d?.textMessageData?.textMessage ?? d?.extendedTextMessageData?.text
  const phone = body.senderData?.senderPhoneNumber
  if (!text || !phone) return

  useChats.getState().addMessage(String(phone), {
    id: body.idMessage ?? String(body.timestamp),
    text,
    out: false,
    ts: body.timestamp * 1000,
  })

  void loadContact(creds, String(phone))
}

export function useNotifications() {
  const creds = useAuth((s) => s.creds)

  useEffect(() => {
    if (!creds) return
    const ctrl = new AbortController()

    ;(async () => {
      while (!ctrl.signal.aborted) {
        try {
          const n = await receiveNotification(creds, ctrl.signal)
          if (!n) continue
          handle(n, creds)
          await deleteNotification(creds, n.receiptId, ctrl.signal)
        } catch {
          if (ctrl.signal.aborted) return
          await sleep(3000)
        }
      }
    })()

    return () => ctrl.abort()
  }, [creds])
}