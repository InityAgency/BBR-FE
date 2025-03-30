import { EndpointBuilder, EndpointParams } from '../client/types';


export const amenitiesEndpoints = {
  list: ((params?: EndpointParams) => {
    const query = new URLSearchParams(params?.query as Record<string, string>).toString();
    return `/amenities${query ? `?${query}` : ''}`;
  }) as EndpointBuilder,

  create: (() => '/amenities') as EndpointBuilder,

  update: ((params?: EndpointParams) => `/amenities/${params?.id}`) as EndpointBuilder,

  delete: ((params?: EndpointParams) => `/amenities/${params?.id}`) as EndpointBuilder,

  details: ((params?: EndpointParams) => `/amenities/${params?.id}`) as EndpointBuilder,

  uploadIcon: (() => '/media?type=AMENITY') as EndpointBuilder,
};
