import { Subject, of, concat } from "rxjs";
import { switchMap, shareReplay, delay } from "rxjs/operators";
import { getJwtBody } from "./jwt";

export class AuthenticationService {
  private readonly rawToken = new Subject<string>();
  public readonly activeToken = this.rawToken.pipe(
    switchMap(token => {
      const body = getJwtBody(token);
      if (body) {
        const issue = new Date();
        const timeOffset = issue.getTime() - Number(body.iat) * 1000;
        const expiration = new Date(Number(body.exp) * 1000 + timeOffset);
        console.log(expiration);

        return concat(of({ body, token }), of(null).pipe(delay(expiration)));
      }
      return of(null);
    }),
    shareReplay(1)
  );

  constructor(initialToken: string) {
    this.activeToken.subscribe();
    this.rawToken.next(initialToken);
  }
}
