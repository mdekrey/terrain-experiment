import { Subject, of, concat } from "rxjs";
import { switchMap, shareReplay, delay, filter, map, switchAll } from "rxjs/operators";
import { getJwtBody } from "./jwt";
import { HubClient } from "../api";

export class AuthenticationService {
  private readonly hubClient: HubClient;
  private readonly rawToken = new Subject<string>();
  public readonly activeToken = this.rawToken.pipe(
    switchMap(token => {
      const body = getJwtBody(token);
      if (body) {
        const issue = new Date();
        const timeOffset = issue.getTime() - Number(body.iat) * 1000;
        const expiration = new Date(Number(body.exp) * 1000 + timeOffset);
        console.log(expiration);

        return concat(of({ body, token, expiration }), of(null).pipe(delay(expiration)));
      }
      return of(null);
    }),
    shareReplay(1)
  );

  constructor(initialToken: string, hub: HubClient) {
    this.hubClient = hub;
    this.activeToken.subscribe();
    this.rawToken.next(initialToken);
    this.activeToken
      .pipe(
        filter(r => Boolean(r)),
        map(r => r!.token),
        map(token => this.hubClient.jwt$(token)),
        switchAll()
      ).subscribe(token => this.rawToken.next(token));
  }
}
