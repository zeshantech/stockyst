import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak, { KeycloakProfile } from "keycloak-js";

interface KeycloakContextProps {
  keycloak: Keycloak.KeycloakInstance | null;
  login: (redirectUri?: string) => void;
  logout: (redirectUri?: string) => void;
  profile: KeycloakProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const KeycloakContext = createContext<KeycloakContextProps>({
  keycloak: null,
  login: () => {},
  logout: () => {},
  profile: null,
  isAuthenticated: false,
  isLoading: true,
});

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
  children: React.ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({
  children,
}) => {
  const [keycloak, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  const [profile, setProfile] = useState<KeycloakProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const keycloakInstance = new Keycloak({
          url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
          realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
        });

        // Initialize Keycloak without forcing login redirection
        const authenticated = await keycloakInstance.init({
          onLoad: null, // Don't automatically load anything 
          checkLoginIframe: false, // Disable iframe check to prevent redirects
          pkceMethod: 'S256'
        });

        setKeycloak(keycloakInstance);
        setIsAuthenticated(authenticated);
        
        // Load user profile only if authenticated
        if (authenticated) {
          try {
            const userProfile = await keycloakInstance.loadUserProfile();
            setProfile(userProfile);
            
            // Set up token refresh
            keycloakInstance.onTokenExpired = () => {
              keycloakInstance.updateToken(30).catch(() => {
                console.warn('Token refresh failed');
                // Don't logout on failure - just warn
              });
            };
          } catch (profileError) {
            console.error("Failed to load user profile:", profileError);
          }
        }
      } catch (error) {
        console.error("Keycloak initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
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
      setIsAuthenticated(false);
      setProfile(null);
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
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};