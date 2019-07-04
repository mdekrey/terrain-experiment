import { injectorBuilder, Scope, InjectedServices } from "../injector";
import { AuthenticationService } from "./AuthenticationService";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    authenticationService: AuthenticationService;
    commonHeaders: Record<string, string | string[]>;
  }
}

const result: InjectedServices["commonHeaders"] = {};
injectorBuilder.set("commonHeaders", Scope.Singleton, () => result);

injectorBuilder.set("authenticationService", Scope.Singleton, injector => {
  const headers = injector("commonHeaders");
  const hash = window.location ? window.location.hash.substr(1) : "";
  if (hash) {
    window.location.hash = "#";
  }
  const service = new AuthenticationService(hash, injector("hubClient"));
  service.activeToken.subscribe(current => {
    headers["Authorization"] = current ? `Bearer ${current.token}` : [];
  });
  return service;
});
