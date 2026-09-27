import { useEffect, useMemo, useRef, useState } from "react";
import { App, Avatar, Button, Empty, Input, Tooltip, Typography } from "antd";
import { ArrowLeftOutlined, LogoutOutlined, PlusOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/entities/session/model";
import { useChats } from "@/entities/chat/model";
import { sendMessage } from "@/shared/api/green-api";
import { useNotifications } from "@/shared/lib/use-notifications";
import styles from "./main-page.module.css";
import { loadContact } from "@/shared/lib/load-contact";

const normalizePhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = "7" + d.slice(1);
  return d;
};

const formatPhone = (p: string) => `+${p}`;

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const MainPage = () => {
  useNotifications();

  const creds = useAuth((s) => s.creds);
  const logout = useAuth((s) => s.logout);
  const { chats, contacts, active, openChat, closeChat, addMessage } = useChats();
  const { message } = App.useApp();
  const displayName = (p: string) => contacts[p]?.name || formatPhone(p);

  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = active ? chats[active] ?? [] : [];

  const chatList = useMemo(
    () =>
      Object.entries(chats)
        .map(([p, list]) => ({ phone: p, last: list[list.length - 1] }))
        .sort((a, b) => (b.last?.ts ?? 0) - (a.last?.ts ?? 0)),
    [chats],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, active]);

  const handleCreate = () => {
    const p = normalizePhone(phone);
    if (p.length < 11 || p.length > 12) {
      message.error("Введите номер в формате 79991234567");
      return;
    }
    openChat(p);
    if (creds) void loadContact(creds, p);
    setPhone("");
  };

  const handleSend = async () => {
    const t = text.trim();
    if (!t || !active || !creds) return;

    setSending(true);
    try {
      const { idMessage } = await sendMessage(creds, active, t);
      addMessage(active, { id: idMessage, text: t, out: true, ts: Date.now() });
      setText("");
    } catch {
      message.error("Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <main className={`${styles.layout} ${active ? styles.chatOpen : ""}`}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <Typography.Title level={4} className={styles.sidebarTitle}>
            Чаты
          </Typography.Title>
          <Tooltip title="Выйти">
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} />
          </Tooltip>
        </header>

        <div className={styles.newChat}>
          <Input
            placeholder="Номер получателя"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={handleCreate}
            inputMode="tel"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} />
        </div>

        <ul className={styles.chatList}>
          {chatList.map(({ phone: p, last }) => (
            <li
              key={p}
              className={`${styles.chatItem} ${p === active ? styles.chatItemActive : ""}`}
              onClick={() => openChat(p)}
            >
              <Avatar size={44} src={contacts[p]?.avatar || undefined} icon={<UserOutlined />} />
              <div className={styles.chatInfo}>
                <div className={styles.chatRow}>
                  <span className={styles.chatName}>{displayName(p)}</span>
                  {last && <span className={styles.chatTime}>{formatTime(last.ts)}</span>}
                </div>
                <span className={styles.chatPreview}>
                  {last ? `${last.out ? "Вы: " : ""}${last.text}` : "Нет сообщений"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className={styles.chat}>
        {active ? (
          <>
            <header className={styles.chatHeader}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={closeChat}
                className={styles.backButton}
                aria-label="Назад к списку чатов"
              />
              <Avatar size={40} src={contacts[active]?.avatar || undefined} icon={<UserOutlined />} />
              <div className={styles.chatInfo}>
                <span className={styles.chatName}>{displayName(active)}</span>
                {contacts[active]?.name && <span className={styles.chatPreview}>{formatPhone(active)}</span>}
              </div>
            </header>

            <div className={styles.messages}>
              {messages.map((m) => (
                <div key={m.id} className={`${styles.bubble} ${m.out ? styles.out : styles.in}`}>
                  <span className={styles.bubbleText}>{m.text}</span>
                  <span className={styles.bubbleTime}>{formatTime(m.ts)}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <footer className={styles.composer}>
              <Input.TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Сообщение"
                autoSize={{ minRows: 1, maxRows: 6 }}
                maxLength={4000}
                variant="borderless"
                className={styles.textarea}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={sending}
                disabled={!text.trim()}
              />
            </footer>
          </>
        ) : (
          <div className={styles.placeholder}>
            <Empty description="Введите номер телефона слева, чтобы начать чат" />
          </div>
        )}
      </section>
    </main>
  );
};

export default MainPage;