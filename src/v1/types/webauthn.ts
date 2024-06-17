export type AuthType = 'auto' | 'local' | 'extern' | 'roaming' | 'both';
export type NumAlgo = -7 | -257;
export type NamedAlgo = 'RS256' | 'ES256';
type VerifyParams = {
  algorithm: NamedAlgo;
  publicKey: string;
  authenticatorData: string;
  clientData: string;
  signature: string;
  verbose?: boolean;
};

export type RegistrationChecks = {
  challenge: string | Function;
  origin: string | Function;
};

export type AuthenticationChecks = {
  challenge: string | Function;
  origin: string | Function;
  userVerified: boolean;
  counter?: number;
  domain?: string;
  verbose?: boolean;
};

export type CredentialKey = {
  id: string;
  publicKey: string;
  algorithm: 'RS256' | 'ES256';
};

export type AuthenticationEncoded = {
  credentialId: string;
  authenticatorData: string;
  clientData: string;
  signature: string;
  userHandle?: string;
};

export type RegistrationEncoded = {
  username: string;
  credential: CredentialKey;
  authenticatorData: string;
  clientData: string;
  attestationData?: string;
};

export interface CommonOptions {
  domain?: string;
  userVerification?: UserVerificationRequirement;
  authenticatorType?: AuthType;
  timeout?: number;
  debug?: boolean;
}
export interface AuthenticateOptions extends CommonOptions {
  mediation?: CredentialMediationRequirement;
}

export interface AuthenticationParsed {
  credentialId: string;
  authenticator: AuthenticatorInfo;
  client: ClientInfo;
  signature: string;
}
export interface RegisterOptions extends CommonOptions {
  userHandle?: string;
  attestation?: boolean;
  discoverable?: ResidentKeyRequirement;
}

export interface RegistrationParsed {
  username: string;
  credential: {
    id: string;
    publicKey: string;
    algorithm: 'RS256' | 'ES256';
  };
  authenticator: AuthenticatorInfo;
  client: ClientInfo;
  attestation?: any;
}
export interface ClientInfo {
  type: 'webauthn.create' | 'webauthn.get';
  challenge: string;
  origin: string;
  crossOrigin: boolean;
  tokenBindingId?: {
    id: string;
    status: string;
  };
  extensions?: any;
}
export interface AuthenticatorInfo {
  rpIdHash: string;
  flags: {
    userPresent: boolean;
    userVerified: boolean;
    backupEligibility: boolean;
    backupState: boolean;
    attestedData: boolean;
    extensionsIncluded: boolean;
  };
  counter: number;
  aaguid: string;
  name: string;
  icon_light: string;
  icon_dark: string;
}

export type PasswordlessServer = {
  verifyRegistration: (
    registrationRaw: RegistrationEncoded,
    expected: RegistrationChecks
  ) => Promise<RegistrationParsed>;
  verifyAuthentication: (
    authenticationRaw: AuthenticationEncoded,
    credential: CredentialKey,
    expected: AuthenticationChecks
  ) => Promise<AuthenticationParsed>;
  verifySignature: (params: VerifyParams) => Promise<boolean>;
};
