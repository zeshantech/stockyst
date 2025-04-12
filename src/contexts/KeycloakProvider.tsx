import React, {
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Keycloak from "keycloak-js";
import { createContext } from "react";

interface KeycloakContextProps {
  keycloak: Keycloak.KeycloakInstance | null;
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (
    redirectUri?: string,
    options?: Keycloak.KeycloakLoginOptions
  ) => void;
  logout: (
    redirectUri?: string,
    options?: Keycloak.KeycloakLogoutOptions
  ) => void;
  register: (options?: Keycloak.KeycloakLoginOptions) => void;
  updateToken: (minValidity: number) => Promise<boolean>;
  hasRole: (role: string) => boolean;
  profile: Keycloak.KeycloakProfile | null;
}

const KeycloakContext = createContext<KeycloakContextProps>({
  keycloak: null,
  initialized: false,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  updateToken: () => Promise.resolve(false),
  hasRole: () => false,
  profile: null,
});

export const KeycloakAuthProvider = ({ children }: { children: ReactNode }) => {
  const [keycloak, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(
    null
  );
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const authInstance = new Keycloak(keycloakSetting);

        const authenticated = await authInstance.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          checkLoginIframe: false,
        });

        setKeycloak(authInstance);
        setInitialized(true);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          try {
            const userProfile = await authInstance.loadUserProfile();
            setProfile(userProfile);
          } catch (profileError) {
            console.error("Failed to load user profile:", profileError);
          }

          // Set up token refresh
          authInstance.onTokenExpired = () => {
            authInstance.updateToken(30).catch(() => {
              console.log("Token refresh failed");
            });
          };
        }
      } catch (initError) {
        setError(
          initError instanceof Error ? initError : new Error(String(initError))
        );
        console.error("Keycloak initialization error:", initError);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const login = useCallback(
    (redirectUri?: string, options?: Keycloak.KeycloakLoginOptions) => {
      if (keycloak) {
        keycloak.login({
          ...options,
          redirectUri: redirectUri || undefined,
        });
      }
    },
    [keycloak]
  );

  const logout = useCallback(
    (redirectUri?: string, options?: Keycloak.KeycloakLogoutOptions) => {
      if (keycloak) {
        keycloak.logout({
          ...options,
          redirectUri: redirectUri ?? window.location.origin + "/h",
        });
      }
    },
    [keycloak]
  );

  const register = useCallback(
    (options?: Keycloak.KeycloakLoginOptions) => {
      if (keycloak) {
        keycloak.register(options);
      }
    },
    [keycloak]
  );

  const updateToken = useCallback(
    (minValidity: number): Promise<boolean> => {
      if (keycloak) {
        return keycloak.updateToken(minValidity);
      }
      return Promise.resolve(false);
    },
    [keycloak]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      if (keycloak) {
        return (
          keycloak.hasRealmRole(role) ||
          !!(
            keycloak.resourceAccess &&
            Object.values(keycloak.resourceAccess).some(
              (access) => access.roles && access.roles.includes(role)
            )
          )
        );
      }
      return false;
    },
    [keycloak]
  );

  const contextValue: KeycloakContextProps = {
    keycloak,
    initialized,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateToken,
    hasRole,
    profile,
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};

export function useKeycloak() {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error("useKeycloak must be used within a KeycloakAuthProvider");
  }
  return context;
}

const keycloakSetting = {
  url: "http://localhost:8080",
  realm: "sysmox",
  clientId: "inventree",
};
