import crypto from 'crypto';
import { CognitoIdentityServiceProvider, SES } from 'aws-sdk';
import { Config } from '@/config';

export class OTPService {
  private static instance: OTPService;
  private cognito: CognitoIdentityServiceProvider;
  private ses: SES;

  private constructor() {
    this.cognito = new CognitoIdentityServiceProvider({
      region: Config.aws.region,
      accessKeyId: Config.aws.accessKeyId,
      secretAccessKey: Config.aws.secretAccessKey,
    });

    this.ses = new SES({
      region: Config.aws.region,
      accessKeyId: Config.aws.accessKeyId,
      secretAccessKey: Config.aws.secretAccessKey,
    });
  }

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString().padStart(6, '0');
  }

  private async sendOTPEmail(email: string, otp: string): Promise<void> {
    const params = {
      Source: 'no-reply@backpack.network',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Your OTP Code for Backpack',
        },
        Body: {
          Text: {
            Data: `Your OTP code is: ${otp}`,
          },
        },
      },
    };

    await this.ses.sendEmail(params).promise();
  }

  public static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }
    return OTPService.instance;
  }

  public async issueOTP(email: string): Promise<void> {
    const params = {
      UserPoolId: Config.aws.cognitoUserPoolId,
      Username: email,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: this.generateOTP(),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    await this.cognito.adminCreateUser(params).promise();
    console.log(params.TemporaryPassword);
    // await this.sendOTPEmail(email, params.TemporaryPassword);
  }

  public async verifyOTP(email: string, otp: string): Promise<boolean> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: Config.aws.cognitoAppClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: otp,
      },
    };

    try {
      await this.cognito.initiateAuth(params).promise();
      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  }
}
