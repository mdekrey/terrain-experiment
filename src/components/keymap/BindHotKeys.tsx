import React from "react";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import { KeymapCommand, ContinuousCommand } from "./KeymapCommand";
import { KeymapContext, ContinuousContext } from "./KeymapContext";

type Handlers<T extends KeymapCommand> = Record<T, string>;
type ContinuousHandlers<T extends ContinuousCommand> = Record<T, string>;

export function BindHotKeys<T extends KeymapCommand, TContinuous extends ContinuousCommand>({
  children,
  keyMap,
  continuousMap,
  ...props
}: {
  keyMap: Handlers<T>;
  continuousMap: ContinuousHandlers<TContinuous>
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

  const continuousSet = React.useContext(ContinuousContext);
  React.useEffect(() => {
    continuousSet.clear();
    window.addEventListener("keydown", startCommand, true);
    window.addEventListener("keyup", endCommand, true);

    return () => {
      window.removeEventListener("keydown", startCommand);
      window.removeEventListener("keydown", endCommand);
    };

    function startCommand(e: KeyboardEvent) {
      if (!e.repeat) {
        for (let command of (Object.keys(continuousMap) as TContinuous[]).filter(k => continuousMap[k] === e.key)) {
          continuousSet.add(command);
        }
      }
    }

    function endCommand(e: KeyboardEvent) {
      for (let command of (Object.keys(continuousMap) as TContinuous[]).filter(k => continuousMap[k] === e.key)) {
        continuousSet.delete(command);
      }
    }
  }, [continuousMap, continuousSet])

  return (
    <HotKeys handlers={handlers} keyMap={keyMap} {...props}>
      {children}
    </HotKeys>
  );
};
