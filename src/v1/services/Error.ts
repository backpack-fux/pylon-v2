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

export class WorldpayError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'WorldpayError';
    this.statusCode = statusCode;
  }
}
