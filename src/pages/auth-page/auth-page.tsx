import { useState } from "react";
import { Alert, App, Button, Card, Form, Input, Typography } from "antd";
import { useAuth } from "@/entities/session/model";
import { getStateInstance, type Creds } from "@/shared/api/green-api";
import styles from "./auth-page.module.css";
import { useNavigate } from "react-router-dom";

const STATE_ERRORS: Record<string, string> = {
  notAuthorized: "Инстанс не авторизован — подключите аккаунт MAX в личном кабинете GREEN-API",
  blocked: "Аккаунт MAX заблокирован",
  starting: "Инстанс запускается, попробуйте через несколько минут",
  pendingPassword: "Завершите авторизацию: введите пароль 2FA в личном кабинете GREEN-API",
};

const AuthPage = () => {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: Creds) => {
    const creds: Creds = {
      idInstance: values.idInstance.trim(),
      apiTokenInstance: values.apiTokenInstance.trim(),
    };

    setLoading(true);
    setError(null);

    try {
      const { stateInstance } = await getStateInstance(creds);

      if (stateInstance === "authorized" || stateInstance === "suspended") {
        if (stateInstance === "suspended") {
          message.warning("Аккаунт ограничен: отправка возможна только номерам из контактов");
        }
        login(creds);
        navigate("/chats", { replace: true });
        return;
      }

      setError(STATE_ERRORS[stateInstance] ?? `Статус инстанса: ${stateInstance}`);
    } catch {
      setError("Неверный idInstance или apiTokenInstance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <Typography.Title level={3} className={styles.title}>
          Вход
        </Typography.Title>
        <Typography.Paragraph type="secondary" className={styles.subtitle}>
          Введите данные инстанса из личного кабинета GREEN-API
        </Typography.Paragraph>

        <Form<Creds> layout="vertical" onFinish={onFinish} disabled={loading} requiredMark={false}>
          <Form.Item
            label="idInstance"
            name="idInstance"
            rules={[
              { required: true, message: "Введите idInstance" },
              { pattern: /^\s*\d+\s*$/, message: "idInstance состоит только из цифр" },
            ]}
          >
            <Input inputMode="numeric" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="apiTokenInstance"
            name="apiTokenInstance"
            rules={[{ required: true, message: "Введите apiTokenInstance" }]}
          >
            <Input.Password autoComplete="off" />
          </Form.Item>

          {error && <Alert type="error" title={error} showIcon className={styles.alert} />}

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Войти
          </Button>
        </Form>
      </Card>
    </main>
  );
};

export default AuthPage;