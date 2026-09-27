import styles from "./error404-page.module.css";
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
    const navigate = useNavigate();
    return(
        <main className={styles.container}>
            <h1 className={styles.title}>Страница не найдена</h1>
            <div className={styles.code}>Ошибка 404</div>
            <button className={styles.btn} onClick={() => navigate(-1)}>Вурнуться назад</button>
        </main>
    );
}

export default Error404Page;