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

export interface CredentialKey {
  id: string;
  publicKey: string;
  algorithm: 'RS256' | 'ES256';
}

export interface AuthenticationEncoded {
  credentialId: string;
  authenticatorData: string;
  clientData: string;
  signature: string;
  userHandle?: string;
}

export interface RegistrationEncoded {
  username: string;
  credential: CredentialKey;
  authenticatorData: string;
  clientData: string;
  attestationData?: string;
}
