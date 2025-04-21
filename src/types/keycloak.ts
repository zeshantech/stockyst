import Keycloak from 'keycloak-js';

export interface IKeycloakTokenParsed {
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  aud?: string;
  sub?: string;
  typ?: string;
  azp?: string;
  nonce?: string;
  session_state?: string;
  acr?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
  scope?: string;
  sid?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
};

export type KeycloakInstance = Keycloak;