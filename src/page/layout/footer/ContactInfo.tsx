'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '@/styles/layout/footer.module.css';

interface ContactInfoProps {
  title: string;
  address: string;
  email: string;
  phone: string;
}

export default function ContactInfo({
  title,
  address,
  email,
  phone,
}: ContactInfoProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const width = titleRef.current.offsetWidth;
      titleRef.current.style.setProperty('--title-width', `${width}px`);
    }
  }, []);

  return (
    <div className={styles.footerSection}>
      <h3 ref={titleRef}>{title}</h3>
      <ul className={styles.footerSectionContent}>
        <li className={styles.contactItem}>
          <Link className={styles.footerLink}
            href='https://www.google.com/maps/place/%D0%9D%D1%8C%D1%8E-%D0%99%D0%BE%D1%80%D0%BA,+%D0%A1%D0%A8%D0%90/@40.6971415,-73.979506,9z/data=!4m6!3m5!1s0x89c24fa5d33f083b:0xc80b8f06e177fe62!8m2!3d40.7127753!4d-74.0059728!16zL20vMDJfMjg2?g_ep=Eg1tbF8yMDI1MDUwNV8xIJvbDyoASAJQAQ%3D%3D'>
            {address}
          </Link>
        </li>
        <li className={styles.contactItem}>
          <Link className={styles.footerLink}
            href={`mail:${email}`}>
            {email}
          </Link>
        </li>
        <li className={styles.contactItem}>
          <Link className={styles.footerLink}
            href={ formatPhoneForHref(phone) }>
            {phone}
          </Link>
        </li>
      </ul>
    </div>
  );
}

/**
 * Очищает телефонный номер и подготавливает его для использования в href="tel:"
 * Если номер начинается с '+', код страны берётся из него.
 * @param phoneNumber Телефонный номер в произвольном формате
 * @returns Строка в формате tel:+1234567890
 */
function formatPhoneForHref(phoneNumber: string): string {
  const hasPlus = phoneNumber.trim().startsWith('+');
  const digits = phoneNumber.replace(/\D/g, '');

  const formatted = hasPlus ? `+${digits}` : `+1${digits}`; // +1 — код по умолчанию (например, для США/Канады)

  return `tel:${formatted}`;
}