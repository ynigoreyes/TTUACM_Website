import { TestBed } from '@angular/core/testing';

import { ContactFormComponent } from './contact-form.component';
import { FakeSnackBar } from '@acm-shared/mocks/snackbar.mock';
import {
  FakeSuccessContactService,
  FakeFailureContactService
} from '../../services/fake-contact.service';
import { FakeMessage } from '../../mocks/contact-posts.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactPost } from '../../models/contact-form.model';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fakeSnackBar = FakeSnackBar;
  let fakeMessage: ContactPost = FakeMessage;
  let contactSuccessService: FakeSuccessContactService;
  let contactFailureService: FakeFailureContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FakeSuccessContactService, FakeFailureContactService]
    });
    contactSuccessService = TestBed.get(FakeSuccessContactService);
    contactFailureService = TestBed.get(FakeFailureContactService);
    component = new ContactFormComponent(<any>fakeSnackBar, contactSuccessService);
  });

  it('Post without any errors when given a valid post', () => {
    expect(component.onSubmit(<any>fakeMessage)).toBeUndefined();
  });

  it('Handle the errors when given a invalid post or Internal Server Error', () => {
    component = new ContactFormComponent(<any>fakeSnackBar, contactFailureService);
    expect(component.onSubmit(<any>fakeMessage)).toBeUndefined();
  });
});
