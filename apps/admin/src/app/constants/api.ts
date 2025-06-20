// Get API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get API version from environment variables
export const API_VERSION = 'v1';

export const REVIEWS = {
  GET_ALL: "/reviews",
  GET_BY_ID: (id: string) => `/reviews/${id}`,
  UPDATE_STATUS: (id: string) => `/reviews/${id}/status`,
};

export const LEADS = {
  GET_ALL: "/leads",
};

export const B2B_FORM_SUBMISSIONS = {
  GET_ALL: "/b2b-form-submissions",
};