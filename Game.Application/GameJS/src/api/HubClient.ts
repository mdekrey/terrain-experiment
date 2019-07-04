import * as signalR from "@aspnet/signalr";
import { Observable } from "rxjs";
import { map, switchMap, shareReplay, tap } from "rxjs/operators";

function adapt<T = any>(stream: signalR.IStreamResult<T>): Observable<T> {
  return new Observable(observer => {
    const subscription = stream.subscribe(observer);
    return () => subscription.dispose();
  });
}

export class HubClient {
  private jwt: string | null = null;
  private readonly connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/hub", { accessTokenFactory: () => this.jwt! })
    .build();
  private readonly connectivity = new Observable<signalR.HubConnection>(
    observer => {
      this.connection
        .start()
        .then(() => observer.next(this.connection), err => observer.error(err));
      return () => {
        this.connection.stop();
      };
    }
  ).pipe(shareReplay(1));

  private hubObservable$<T>(
    methodName: string,
    cast: (d: any) => T,
    ...args: any[]
  ) {
    return this.connectivity
      .pipe(switchMap(connection => adapt(connection.stream(methodName, ...args))))
      .pipe(
        map(cast),
        shareReplay(1)
      );
  }

  public jwt$(originalJwt: string) {
    this.jwt = originalJwt;
    return this.hubObservable$("Jwt", s => s as string).pipe(
      tap(v => this.jwt = v)
    );
  }
}
