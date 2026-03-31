import styles from './styles.module.css'

export function DefaultInput({ id, type, labelText, ...rest }) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      <input className={styles.input} id={id} type={type} {...rest} />
    </>
  )
}