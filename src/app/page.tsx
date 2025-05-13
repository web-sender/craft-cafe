import FeatureSection from '@/home/FeatureSection';
import CoffeeCakesSection from '@/home/CoffeeCakesSection';
import Services from '@/home/Services';
import CategoryListSection from '@/home/CategoryListSection';
import PopularSection from '@/home/PopularSection';
import StoriesSection from '@/home/StoriesSection';
import AdditionalInfoSection from '@/home/AdditionalInfoSection';
import InvocationSection from '@/home/InvocationSection';
import ContactSection from '@/home/ContactSection';
import styles from './page.module.css'

export default async function Home() {
  return (<main className={styles.main}>
    <FeatureSection id="feature"/>
    <CoffeeCakesSection id="coffee-cakes"/>
    <Services id="services"/>
    <CategoryListSection id="category-list"/>
    <PopularSection id="popular"/>
    <AdditionalInfoSection id="additional-info"/>
    <StoriesSection id="stories"/>
    <InvocationSection id="invocation"/>
    <ContactSection id="contact"/>
  </main>)
}