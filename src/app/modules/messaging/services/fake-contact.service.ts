import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ContactService } from './contact.service';
import { of as ObservableOf} from 'rxjs/observable/of';
import { ContactPost } from '../models/contact-form.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';


@Injectable()
export class FakeSuccessContactService extends ContactService {
  constructor(public http: HttpClient) { super(http); }

  sendEmail(message: ContactPost) {
    return ObservableOf({});
  }
}

@Injectable()
export class FakeFailureContactService extends ContactService {
  constructor(public http: HttpClient) { super(http); }

  sendEmail(message: ContactPost): any {
    return new Observable((observer) => {
      observer.next(new Error('New Error'));
    });
  }
}
