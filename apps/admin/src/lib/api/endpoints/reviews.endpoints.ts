import { EndpointBuilder } from '../client/types';

export const reviewsEndpoints = {
  list: (() => '/reviews') as EndpointBuilder,
  details: (({ id } = {}) => `/reviews/${id}`) as EndpointBuilder,
  updateStatus: (({ id } = {}) => `/reviews/${id}/status`) as EndpointBuilder,
  delete: (({ id } = {}) => `/reviews/${id}`) as EndpointBuilder,
};