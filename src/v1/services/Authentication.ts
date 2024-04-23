import crypto from 'crypto';

export class AuthenticationService {
  private static instance: AuthenticationService;

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public async generateChallenge() {
    // Generate a random challenge
    return crypto.randomBytes(32).toString('base64');
  }
}
