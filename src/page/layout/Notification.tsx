'use client'

import { useState } from 'react'
import { CSSProperties } from 'react';
import MenuButton from '@/layout/header/MenuButton';
import { useTranslations } from 'next-intl';
import styles from '@/styles/layout/notification.module.css';

interface NotificationProps {
  cssStyles?: CSSProperties | undefined
}

export default function Notification({ cssStyles = undefined }: NotificationProps) {
  const t = useTranslations('app');
  const [checked, setChecked] = useState<boolean>(false)
  
  const onCancel = (): void => {
    setChecked(true)
  }
  return (
    <div className={`${styles.notification} ${checked ? styles.checked : ''}`}
        style={cssStyles}>
      <div className={styles.notificationMain}>
        <div className={styles.notification_content}>
          <p className={styles.notification_text}>{t('notification')}</p>
        </div>
        <div className={styles.notification_cancel}>
          <MenuButton isOpen={true} toggle={onCancel}/>
        </div>
      </div>
    </div>
  )
}