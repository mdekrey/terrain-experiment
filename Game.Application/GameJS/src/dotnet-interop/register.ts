import { injectorBuilder, Scope } from "../injector";
import { InteropService } from "./InteropService";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    interop: InteropService;
  }
}

injectorBuilder.set("interop", Scope.Singleton, () => new InteropService());
