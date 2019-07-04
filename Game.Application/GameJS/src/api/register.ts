import { injectorBuilder, Scope, InjectedServices } from "../injector";
import { TerrainService, MyService } from "../rxjs-api";
import "../authentication";
import { GenericResolver } from "../injector/generalized/GenericResolver";
import { HubClient } from "./HubClient";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    terrainService: TerrainService;
    myService: MyService;
    hubClient: HubClient;
  }
}

function serviceConstructor<
  T extends { defaultHeaders: Record<string, string | string[]> }
>(ctor: { new (baseUrl: string): T }) {
  return (resolver: GenericResolver<InjectedServices>) => {
    const result = new ctor("/api");
    result.defaultHeaders = resolver("commonHeaders");
    return result;
  };
}

injectorBuilder.set(
  "terrainService",
  Scope.Singleton,
  serviceConstructor(TerrainService)
);

injectorBuilder.set(
  "myService",
  Scope.Singleton,
  serviceConstructor(MyService)
);

injectorBuilder.set(
  "hubClient",
  Scope.Singleton,
  () => new HubClient()
);
