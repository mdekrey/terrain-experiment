import React from "react";
import { map, filter } from "rxjs/operators";
import { KeymapCommand } from "./KeymapCommand";
import { KeymapContext } from "./KeymapContext";

export function useCommand(command: KeymapCommand) {
    return React.useContext(KeymapContext).pipe(
      filter(v => v.command === command),
      map(v => v.event)
    );
  }
