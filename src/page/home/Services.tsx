import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import CardList, { ICard } from './components/CardList';
import styles from '@/styles/home/services.module.css';

type ICardList = ICard[]

export default async function Services({id}: {id: string}) {
  const t = await getTranslations('home.services');
  const imageUrl = t('sectionImage')
  const cards: ICardList = [
    {
      index: '01',
      title: t('cards.0.title'),
      description: t('cards.0.description'),
    },
    {
      index: '02',
      title: t('cards.1.title'),
      description: t('cards.1.description'),
    },
    {
      index: '03',
      title: t('cards.2.title'),
      description: t('cards.2.description'),
    },
    {
      index: '04',
      title: t('cards.3.title'),
      description: t('cards.3.description'),
    },
  ];

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <CardList cards={cards} imageUrl={imageUrl}/>
    </SectionWrapper>
  );
}