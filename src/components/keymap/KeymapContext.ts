import React from "react";
import { KeymapCommand, ContinuousCommand } from "./KeymapCommand";
import { Subject } from "rxjs";

export const KeymapContext = React.createContext(
  new Subject<{ command: KeymapCommand; event?: KeyboardEvent }>()
);

export const ContinuousContext = React.createContext(
  new Set<ContinuousCommand>()
);
