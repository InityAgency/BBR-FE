import { EndpointBuilder, EndpointParams } from '../client/types';

export const brandsEndpoints = {
  list: ((params?: EndpointParams) => {
    const query = new URLSearchParams(params?.query as Record<string, string>).toString();
    return `/brands${query ? `?${query}` : ''}`;
  }) as EndpointBuilder,

  create: (() => '/brands') as EndpointBuilder,

  update: ((params?: EndpointParams) => `/brands/${params?.id}`) as EndpointBuilder,

  delete: ((params?: EndpointParams) => `/brands/${params?.id}`) as EndpointBuilder,

  details: ((params?: EndpointParams) => `/brands/${params?.id}`) as EndpointBuilder,
}; 