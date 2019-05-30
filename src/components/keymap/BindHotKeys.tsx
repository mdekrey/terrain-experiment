import React from "react";
import { HotKeys } from "react-hotkeys";
import { KeymapCommand } from "./KeymapCommand";
import { KeymapContext } from "./KeymapContext";

type Handlers<T extends KeymapCommand> = Record<T, string>;

export function BindHotKeys<T extends KeymapCommand>({
  children,
  keyMap
}: {
  keyMap: Handlers<T>;
  children?: React.ReactNode;
}) {
  const commandEmitter = React.useContext(KeymapContext);
  const handlers = React.useMemo(
    () =>
      (Object.keys(keyMap) as T[]).reduce(
        (prev, command) => {
          prev[command] = event => commandEmitter.next({ command, event });
          return prev;
        },
        {} as Record<T, (keyEvent?: KeyboardEvent) => void>
      ),
    [keyMap, commandEmitter]
  );

  return (
    <HotKeys handlers={handlers} keyMap={keyMap}>
      {children}
    </HotKeys>
  );
};
