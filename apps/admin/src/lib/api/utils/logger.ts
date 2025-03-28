import { AxiosResponse } from 'axios';

export const logApiRequest = (response: AxiosResponse) => {
  if (process.env.NODE_ENV === 'development') {
    const duration = response.config.metadata?.endTime 
      ? response.config.metadata.endTime - response.config.metadata.startTime 
      : undefined;

    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
      duration,
    });
  }
}; 