import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import SectionWrapper from './components/SectionWrapper';
import Category from './components/Category';
import styles from '@/styles/home/categoryList.module.css';

interface ICategory {
  logo: string
  title: string
}
type ICategoryList = ICategory[]

export default async function CategoryListSection({id}: {id: string}) {
  const t = await getTranslations('home.categoryList');
  const imageUrl = t('sectionImage')
  const categories: ICategoryList = [
    {
      logo: '/icon/ice-cream.webp',
      title: t('categories.0.title'),
    },
    {
      logo: '/icon/fruit_sorbets.webp',
      title: t('categories.1.title'),
    },
    {
      logo: '/icon/snack.webp',
      title: t('categories.2.title'),
    },
    {
      logo: '/icon/sundaes.webp',
      title: t('categories.3.title'),
    },
    {
      logo: '/icon/smoothie.webp',
      title: t('categories.4.title'),
    },
    {
      logo: '/icon/drinks.webp',
      title: t('categories.5.title'),
    },
  ];

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <Image className={styles.sectionImage}
        src={imageUrl} fill={true} alt=''/>
      <div className={styles.sectionInner}>
        <div className={styles.categoryListOuter}>
          <div className={styles.categoryListMain}>
            <div className={styles.categoryListInner}>
              {categories.map((category, index) => (
                <Category
                  key={index}
                  logo={category.logo}
                  title={category.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}