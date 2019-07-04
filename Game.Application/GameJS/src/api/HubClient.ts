import * as signalR from "@aspnet/signalr";
import { Observable } from "rxjs";
import { map, switchMap, shareReplay, tap, take } from "rxjs/operators";

function adapt<T = any>(stream: signalR.IStreamResult<T>): Observable<T> {
  return new Observable(observer => {
    const subscription = stream.subscribe(observer);
    return () => subscription.dispose();
  });
}

export class HubClient {
  private readonly connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
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

  private get hubConnection() {
    return this.connectivity.pipe(take(1)).toPromise();
  }

  private hubObservable$<T>(
    methodName: string,
    cast: (d: any) => T,
    ...args: any[]
  ) {
    return this.connectivity
      .pipe(switchMap(connection => adapt(connection.stream(methodName, ...args))))
      .pipe(
        map(cast),
      );
  }

  public jwt$(originalJwt: string) {
    return this.hubObservable$("Jwt", s => s as string, originalJwt);
  }
}
