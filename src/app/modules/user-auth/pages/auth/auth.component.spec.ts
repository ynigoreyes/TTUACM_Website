import { AuthComponent } from './auth.component';
import { FakeSnackBar } from '@acm-shared/mocks/snackbar.mock';
import {
  FakeVerifiedQueryParams,
  FakeErrorQueryParams
} from '../../mocks/activated-router.mock';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fakeVerifiedActivatedRoute: any;
  let fakeErrorActivatedRoute: any;
  let fakeSnackBar: any;
  beforeEach(() => {
    fakeSnackBar = FakeSnackBar;
  });
  it('Should not error out when verify is passed as a queryParam', () => {
    fakeVerifiedActivatedRoute = { queryParams: FakeVerifiedQueryParams };
    component = new AuthComponent(<any>fakeVerifiedActivatedRoute, <any>fakeSnackBar);
    expect(component).toBeTruthy('Error creating component when verify is passed');
  });
  it('Should not error out when an error is passed as a queryParam', () => {
    fakeErrorActivatedRoute = { queryParams: FakeErrorQueryParams };
    component = new AuthComponent(<any>fakeErrorActivatedRoute, <any>fakeSnackBar);
    expect(component).toBeTruthy('Error creating component when error is passed');
  });
});
