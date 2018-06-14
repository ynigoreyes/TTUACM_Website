import { AuthComponent } from './auth.component';
import { FakeSnackBar } from '../../../../shared/mocks/snackbar.mock';
import {
  FakeVerifiedQueryParams,
  FakeErrorQueryParams
} from '../../testing-utils/mocks/activated-router.mock';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fakeVerifiedActivatedRoute: any;
  let fakeErrorActivatedRoute: any;
  let fakeSnackBar: any;
  beforeEach(() => {
    fakeSnackBar = FakeSnackBar;
  });
  fit('Should create a component', () => {
    fakeVerifiedActivatedRoute = { queryParams: FakeVerifiedQueryParams };
    component = new AuthComponent(<any>fakeVerifiedActivatedRoute, <any>fakeSnackBar);
    expect(component).toBeTruthy();
  });
  fit('Should create a component', () => {
    fakeErrorActivatedRoute = { queryParams: FakeErrorQueryParams };
    component = new AuthComponent(<any>fakeErrorActivatedRoute, <any>fakeSnackBar);
    expect(component).toBeTruthy();
  });
});
