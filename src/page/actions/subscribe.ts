'use server';

interface FormState {
  message: string;
  error: boolean;
}

export async function subscribeAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      message: 'Please enter a valid email address.',
      error: true,
    };
  }

  try {
    // Simulate API call or database operation
    // Replace with actual logic (e.g., save to database, send to email service)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      message: 'Successfully subscribed!',
      error: false,
    };
  } catch (error) {
    console.error('This error from subscribe.ts: \n', error)
    return {
      message: 'An error occurred. Please try again later.',
      error: true,
    };
  }
}