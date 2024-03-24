export class PrismaError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    console.log('PrismaError: Invoked');

    super(message);
    this.name = 'PrismaError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
