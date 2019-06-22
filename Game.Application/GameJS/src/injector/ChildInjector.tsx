import React from "react";
import { Scope } from "./Scope";
import { injectorContext } from "./injectorContext";
import { InjectedServices } from "./InjectedServices";

export const ChildInjector = ({
  beginScopes,
  overrideServices = {},
  children,
}: {
  beginScopes: Scope[];
  overrideServices?: Partial<InjectedServices>;
  children?: React.ReactNode;
}) => {
  const injector = React.useContext(injectorContext);
  const childInjector = React.useMemo(() => {
    const result = injector.createChildInjector();
    for (const scope of beginScopes) {
      result.beginScope(scope);
    }
    for (const service in overrideServices) {
      if (overrideServices.hasOwnProperty(service)) {
        const element = overrideServices[service as keyof InjectedServices]!;
        result.setService(service as keyof InjectedServices, element);
      }
    }
    return result;
    // eslint-disable-next-line
  }, [injector]);
  return (
    <injectorContext.Provider value={childInjector}>
      {children}
    </injectorContext.Provider>
  );
};
