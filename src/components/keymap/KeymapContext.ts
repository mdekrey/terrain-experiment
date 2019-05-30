import React from "react";
import { KeymapCommand } from "./KeymapCommand";
import { Subject } from "rxjs";

export const KeymapContext = React.createContext(
  new Subject<{ command: KeymapCommand; event?: KeyboardEvent }>()
);
