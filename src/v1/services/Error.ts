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

export class PasskeyError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string = 'Passkey error',
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PasskeyError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WorldpayError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorName?: string | undefined
  ) {
    super(message);
    this.name = 'WorldpayError';
    this.errorName = errorName;
    this.statusCode = statusCode;
  }
}

export class BridgeError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly bridgeErrorCode: string,
    public readonly errorName?: string
  ) {
    super(message);
    this.name = 'BridgeError';
  }
}
