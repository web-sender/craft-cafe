import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import styles from '@/styles/home/additionalInfo.module.css';

export default async function AdditionalInfoSection({id}: {id: string}) {
  const t = await getTranslations('home.additionalInfo');
  const imageUrl = t('sectionImage')

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <div className={styles.cardContainer}>
          <div className={styles.cardImageWrapper}>
            <div className={styles.cardImageContainer}>
              <Image className={styles.cardImage}
                  src={imageUrl} fill={true} alt=''/>
            </div>
            <div className={styles.decorTopLeft} ></div>
            <div className={styles.decorBottomRight} ></div>
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{t('title')}</h2>
            <p className={styles.cardDescription}>{t('description')}</p>
            <button className={styles.cardButton}>{t('button')}</button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}