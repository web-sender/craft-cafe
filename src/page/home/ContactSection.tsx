import Image from 'next/image'
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import styles from '@/styles/home/contact.module.css';

export default async function ContactSection({id}: {id: string}) {
  const t = await getTranslations('home.contact');
  const imageUrl = t('sectionImage')

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <div className={styles.contentContainer}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <Image className={styles.image}
                src={imageUrl} fill={true} alt=''/>
            </div>
          </div>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>{t('title')}</h2>
            <form className={styles.form}>
              <div className={styles.formField}>
                <label htmlFor="name" className={styles.fieldLabel}>
                  {t('fields.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('fields.namePlaceholder')}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="email" className={styles.fieldLabel}>
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('fields.emailPlaceholder')}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="message" className={styles.fieldLabel}>
                  {t('fields.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  required
                />
              </div>
              <div className={styles.agreement}>
                <input
                  type="checkbox"
                  id="agreement"
                  name="agreement"
                  required
                />
                <label htmlFor="agreement" className={styles.agreementLabel}>
                  {t('agreement.text')}{' '}
                  <Link href="/terms" className={styles.agreementLink}>
                    {t('agreement.link')}
                  </Link>
                </label>
              </div>
              <button type="submit" className={styles.submitButton}>
                {t('button')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}