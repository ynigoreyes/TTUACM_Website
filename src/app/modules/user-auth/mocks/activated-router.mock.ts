import { Observable } from 'rxjs/Observable';

/**
 * @description a mock of the verified Activated Route
 */
export const FakeVerifiedQueryParams = new Observable(observer => {
  const params = {
    verify: true
  };
  observer.next(params);
  observer.complete();
});

/**
 * @description a mock of the error Activated Route
 */
export const FakeErrorQueryParams = new Observable(observer => {
  const params = {
    err: true
  };
  observer.next(params);
  observer.complete();
});
