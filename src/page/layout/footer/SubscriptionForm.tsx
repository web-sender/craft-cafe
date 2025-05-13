'use client';

import { useEffect, useRef } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import styles from '@/styles/layout/footer.module.css';
import { subscribeAction } from '@/actions/subscribe';

interface SubscriptionFormProps {
  title: string;
  placeholder: string;
  buttonText: string;
}

interface FormState {
  message: string;
  error: boolean;
}

const initialState: FormState = {
  message: '',
  error: false,
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={styles.formButton}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Submitting...' : text}
    </button>
  );
}

export default function SubscriptionForm({
  title,
  placeholder,
  buttonText,
}: SubscriptionFormProps) {
  const [state, formAction] = useFormState(subscribeAction, initialState);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const width = titleRef.current.offsetWidth;
      titleRef.current.style.setProperty('--title-width', `${width}px`);
    }
  }, []);

  return (
    <div className={styles.subscriptionForm}>
      <h3 ref={titleRef}>{title}</h3>
      <form action={formAction} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          className={styles.formInput}
          required
          aria-label="Email for subscription"
        />
        <SubmitButton text={buttonText} />
        {state.message && (
          <p className={state.error ? styles.error : styles.success}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}