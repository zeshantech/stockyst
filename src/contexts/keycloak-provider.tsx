import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak, { KeycloakProfile } from "keycloak-js";

interface KeycloakContextProps {
  keycloak: Keycloak.KeycloakInstance | null;
  login: (redirectUri?: string) => void;
  logout: (redirectUri?: string) => void;
  profile: KeycloakProfile | null;
}

const KeycloakContext = createContext<KeycloakContextProps>({
  keycloak: null,
  login: () => {},
  logout: () => {},
  profile: null,
});

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
  children: React.ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({
  children,
}) => {
  const [keycloak, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(
    null
  );
  const [profile, setProfile] = useState<KeycloakProfile | null>(null);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "sysmox",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "stockyst",
    });

    keycloakInstance.init().then((authenticated) => {
      setKeycloak(keycloakInstance);

      if (authenticated) {
        keycloakInstance
          .loadUserProfile()
          .then((userProfile) => {
            setProfile(userProfile);
          })
          .catch((error) => {
            console.error("Failed to load user profile:", error);
          });
      }
    });
  }, []);

  const login = (redirectUri?: string) => {
    if (keycloak) {
      keycloak.login({
        redirectUri: redirectUri ?? window.location.origin,
      });
    }
  };

  const logout = (redirectUri?: string) => {
    if (keycloak) {
      keycloak.logout({
        redirectUri: redirectUri ?? window.location.origin,
      });
    }
  };

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        login,
        logout,
        profile,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};
