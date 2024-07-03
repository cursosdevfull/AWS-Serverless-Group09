import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { Subject } from 'rxjs';

const POOL_DATA = {
  UserPoolId: 'us-east-1_TXE7i4sUn',
  ClientId: '378asl2645rbinpnjcvqafkgo1',
};

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private notification: Subject<string> = new Subject<string>();

  constructor() {}

  signUp(
    username: string,
    email: string,
    password: string,
    family_name: string
  ) {
    const emailAttribute = {
      Name: 'email',
      Value: email,
    };

    const familyNameAttribute = {
      Name: 'family_name',
      Value: family_name,
    };

    const attrList: CognitoUserAttribute[] = [
      new CognitoUserAttribute(emailAttribute),
      new CognitoUserAttribute(familyNameAttribute),
    ];

    userPool.signUp(
      username,
      password,
      attrList,
      [],
      (err: any, result: any) => {
        if (err) {
          this.notification.next('Fail to sign up');
          return;
        }

        const cognitoUser = result.user;
        console.log(`username is ${cognitoUser.getUsername()}`);
        this.notification.next(`Signed up as ${cognitoUser.getUsername()}`);
      }
    );
  }

  getNotification() {
    return this.notification.asObservable();
  }

  confirmRegistration(username: string, code: string) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err: any, result: any) => {
      if (err) {
        console.log(err);
        this.notification.next('Failed to confirm registration');
        return;
      }

      console.log('call result: ' + result);
      this.notification.next('Confirmed registration');
    });
  }

  signIn(username: string, password: string) {
    const authenticationData = {
      Username: username,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        this.notification.next('Logged in');
        console.log('access token + ' + result.getAccessToken().getJwtToken());
      },

      onFailure: (err: any) => {
        this.notification.next('Failed to login');
        console.log(err);
      },
    });
  }

  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }

  askForPasswordReset(username: string) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (result: any) => {
        this.notification.next('Password reset code sent');
        console.log('call result: ' + result);
      },

      onFailure: (err: any) => {
        this.notification.next('Failed to send password reset code');
        console.log(err);
      },
    });
  }

  generateNewPassword(username: string, code: string, newPassword: string) {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        this.notification.next('New password changed');
        console.log('Password changed!');
      },

      onFailure: (err: any) => {
        this.notification.next('Failed to change password');
        console.log(err);
      },
    });
  }

  logout() {
    this.getAuthenticatedUser()?.signOut();
  }
}
