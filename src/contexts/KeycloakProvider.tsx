import React, { ReactNode, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";
import { createContext } from "react";

interface IkeycloakContextProps {
  keycloak?: Keycloak.KeycloakInstance;
  initialized: boolean;
}

const keycloakContext = createContext<IkeycloakContextProps | undefined>(
  undefined
);

export const KeycloakAuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  const authInstance = new Keycloak(keycloakSetting);

  useEffect(() => {
    const initialize = async () => {
      try {
        const authenticated = await authInstance.init({ onLoad: "check-sso" });
        if (authenticated) setInitialized(true);
        else setInitialized(false);
      } catch (error) {
        throw new Error(error as any);
      }
    };
    initialize();
  }, []);

  return (
    <keycloakContext.Provider value={{ initialized, keycloak: authInstance }}>
      {children}
    </keycloakContext.Provider>
  );
};

export function useKeycloak() {
  const context = useContext(keycloakContext);
  if (!context?.keycloak) {
    throw new Error("Cannot use useKeycloak outside the KeycloakProvider");
  }

  return context;
}

const keycloakSetting = {
  url: "http://localhost:8080",
  realm: "sysmox",
  clientId: "inventree",
};
