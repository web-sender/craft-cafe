import styles from '@/styles/layout/footer.module.css';

interface EstablishedProps {
  text: string;
}

export default function Established({ text }: EstablishedProps) {
  return (
    <div className={styles.established}>
      <p>{text}</p>
    </div>
  );
}