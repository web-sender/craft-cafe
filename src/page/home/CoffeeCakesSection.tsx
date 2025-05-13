import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import Part from './components/Part';
import styles from '@/styles/home/coffeeCakes.module.css';

interface IPart {
  type: 'image' | 'card' | 'text';
  image?: string;
  title?: string;
  description?: string;
  isFirst?: boolean;
  isLast?: boolean;
}
type IPartGrid = IPartColumn[]
type IPartColumn = IPart[]

export default async function CoffeeCakesSection({id}: {id: string}) {
  const t = await getTranslations('home.coffeeCakes');
  const parts: IPartGrid = [
    [
      {
        type: 'image',
        image: t('parts.0.image'),
        isFirst: true,
      },
      {
        type: 'text',
        description: t('parts.1.description'),
      },
      {
        type: 'card',
        title: t('parts.2.title'),
        description: t('parts.2.description'),
      },
    ],
    [
      {
        type: 'card',
        title: t('parts.3.title'),
        description: t('parts.3.description'),
      },
      {
        type: 'text',
        description: t('parts.4.description'),
      },
      {
        type: 'image',
        image: t('parts.5.image'),
        isLast: true,
      },
    ],
  ];

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>
        <div className={styles.partListOuter}>
          <div className={styles.partListInner}>
            {parts.map((column, colIndex) => (
              <div key={colIndex} className={styles.column}>
                {column.map((part, partIndex) => (
                  <Part
                    key={partIndex}
                    type={part.type}
                    image={part.image}
                    title={part.title}
                    description={part.description}
                    isFirst={part.isFirst}
                    isLast={part.isLast}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}