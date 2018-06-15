import { FormGroup } from '@angular/forms';

export class UserPost extends FormGroup {
  public firstName: string;
  public lastName: string;
  public email: string;
  public classification: string;
  public password: string;
  public confirmPassword: string;
}
/**
 * User object that persists throughout session
 */
export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  classification?: string;
  password?: string;
  confirmPassword?: string;
}
