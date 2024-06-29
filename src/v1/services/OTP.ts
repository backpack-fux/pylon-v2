import crypto from 'crypto';
import { FastifyInstance } from 'fastify/types/instance';
import { Resend } from 'resend';
import { Config } from '@/config';

export class OTPService {
  private static instance: OTPService;
  private redis: FastifyInstance['redis'];
  private resend: Resend;

  private constructor(fastify: FastifyInstance) {
    this.redis = fastify.redis;
    this.resend = new Resend(Config.resend.apiKey);
  }

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString().padStart(6, '0');
  }

  public static getInstance(fastify: FastifyInstance): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService(fastify);
    }
    return OTPService.instance;
  }

  public async issueOTP(email: string): Promise<void> {
    const otp = this.generateOTP();
    await this.redis.set(`otp:${email}`, otp, 'EX', 3600); // Expires in 1 hour
    await this.sendOTPEmail(email, otp);
  }

  private async sendOTPEmail(email: string, otp: string): Promise<void> {
    this.resend.emails.send({
      from: 'no-reply@backpack.network',
      to: email,
      subject: 'Your OTP for Backpack',
      html: `<p>Your One-Time Passcode is ${otp}. This expires in 1 hour.</p>`,
    });
  }

  public async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${email}`);
    if (storedOtp === otp) {
      await this.redis.del(`otp:${email}`);
      return true;
    }
    return false;
  }
}
