import test from 'node:test';
import { EndpointBuilder } from '../client/types';

export const authEndpoints = {
  login: (() => '/auth/login/admin') as EndpointBuilder,
  logout: (() => '/auth/logout') as EndpointBuilder,
  me: (() => '/auth/me') as EndpointBuilder,
  test: (() => '/auth/test') as EndpointBuilder,
  requestResetPassword: (() => '/auth/request-reset-password') as EndpointBuilder,
  verifyResetPassword: (() => '/auth/verify-otp') as EndpointBuilder,
  resetPassword: (() => '/auth/reset-password') as EndpointBuilder,
}; 