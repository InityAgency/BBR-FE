import { EndpointBuilder } from '../client/types';

export const settingsEndpoints = {
  get: (() => '/settings') as EndpointBuilder,
  update: (() => '/settings') as EndpointBuilder,
}; 