export const newsletterService = {
    async subscribe(email: string) {
      try {
        if (!email) {
          throw new Error('Email is required');
        }
  
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'An error occurred during subscription');
        }
  
        return data;
      } catch (error) {
        console.error('Newsletter error:', error);
        throw error;
      }
    }
  }