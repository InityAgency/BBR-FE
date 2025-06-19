import { ApiEndpoints } from '../client/types';
import { authEndpoints } from './auth.endpoints';
import { usersEndpoints } from './users.endpoints';
import { brandsEndpoints } from './brands.endpoints';
import { settingsEndpoints } from './settings.endpoints';
import { amenitiesEndpoints } from './amenities.endpoints';
import { reviewsEndpoints } from './reviews.endpoints';

export const API_ENDPOINTS: ApiEndpoints = {
  auth: authEndpoints,
  users: usersEndpoints,
  brands: brandsEndpoints,
  amenities: amenitiesEndpoints,
  settings: settingsEndpoints,
  reviews: reviewsEndpoints
}; 
