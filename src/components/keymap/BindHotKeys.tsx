import React from "react";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import { KeymapCommand } from "./KeymapCommand";
import { KeymapContext } from "./KeymapContext";

type Handlers<T extends KeymapCommand> = Record<T, string>;

export function BindHotKeys<T extends KeymapCommand>({
  children,
  keyMap,
  ...props
}: {
  keyMap: Handlers<T>;
  children?: React.ReactNode;
} & Omit<HotKeysProps, "handlers" | "keymap">) {
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
    <HotKeys handlers={handlers} keyMap={keyMap} {...props}>
      {children}
    </HotKeys>
  );
};
