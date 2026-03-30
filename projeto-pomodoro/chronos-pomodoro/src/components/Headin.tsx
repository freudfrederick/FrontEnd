import styles from "./Heading.module.css"

export function Heading() {
    return (
        <>
            <h1 className={`${styles.Heading}, ${styles.cyanText}`}>
                Curso de Introdução ao React
            </h1>
            <p className={styles.cyanText}>
                Venha fazer parte deste mundo de desenvolvimento
            </p>
            <button className={styles.button}>Clique Aqui</button>
        </>
    )
}