import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import styles from '@/styles/home/stories.module.css';

interface StoryCardProps {
  imageUrl: string
  title: string
  key: string | number
}

function StoryCard({ imageUrl, title }: StoryCardProps) {
  return (
    <div className={styles.cardOuter}>
      <div className={styles.cardMain} >
        <Image className={styles.cardImage}
          src={imageUrl} fill={true} alt={title}/>
      </div>
    </div>
  );
}

export default async function StoriesSection({id}: {id: string}) {
  const t = await getTranslations('home.cakeDessert');
  const stories = [
    { title: t('stories.0.title'), imageUrl: t('stories.0.image') },
    { title: t('stories.1.title'), imageUrl: t('stories.1.image') },
    { title: t('stories.2.title'), imageUrl: t('stories.2.image') },
    { title: t('stories.3.title'), imageUrl: t('stories.3.image') },
    { title: t('stories.4.title'), imageUrl: t('stories.4.image') },
    { title: t('stories.5.title'), imageUrl: t('stories.5.image') },
  ];

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>
        <div className={styles.cardListOuter}>
          <div className={styles.cardListMain}>
            <div className={styles.cardListInner}>
              {stories.map((story, index) => (
                <StoryCard key={index} 
                  imageUrl={story.imageUrl}
                  title={story.title} />
              ))}
            </div>
          </div>
        </div>
        <button className={styles.sectionButton}>{t('button')}</button>
      </div>
    </SectionWrapper>
  );
}