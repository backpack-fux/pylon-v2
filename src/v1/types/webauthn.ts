export interface RegistrationChecks {
  challenge: string | Function;
  origin: string | Function;
}

export interface AuthenticationChecks {
    challenge: string | Function;
    origin: string | Function;
    userVerified: boolean;
    counter?: number;
    domain?: string;
    verbose?: boolean;
}