import styles from "./main-page.module.css";
import { useMessagesStore } from "@/shared/store/messages-store";
const MainPage = () => {
  const { message } = useMessagesStore();
  return (
    <main>
        {message}
    </main>
  );
};

export default MainPage;