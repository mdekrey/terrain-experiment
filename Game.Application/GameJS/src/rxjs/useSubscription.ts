import { Observable, Subject } from "rxjs";
import { switchAll, withLatestFrom } from "rxjs/operators";
import { useEffect, useMemo } from "react";

export const useSubscription = <T>(
  observable: Observable<T>,
  callback: (data: T) => void
) => {
  const observable$ = useMemo(() => new Subject<Observable<T>>(), []);
  const observer$ = useMemo(() => new Subject<(data: T) => void>(), []);

  useEffect(() => {
    const subscription = observable$
      .pipe(
        switchAll(),
        withLatestFrom(observer$)
      )
      .subscribe(([value, observer]) => observer(value));
    return () => subscription.unsubscribe();
  }, [observable$, observer$]);

  useEffect(() => {
    observer$.next(callback);
  }, [callback, observer$]);

  useEffect(() => {
    observable$.next(observable);
  }, [observable, observable$]);
};
