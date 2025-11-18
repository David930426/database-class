// Define the structure of the object returned by the server action
export type FormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export type SessionPayload = {
  // UserID dari database SQL Server (INT IDENTITY)
  userId: number;

  // Opsional: Username untuk tampilan cepat di UI
  // username?: string;

  // Opsional: Timestamp kapan token dikeluarkan (biasanya diset otomatis oleh .setIssuedAt())
  // iat: number;

  // Opsional: Timestamp kapan token kedaluwarsa (biasanya diset otomatis oleh .setExpirationTime())
  // exp: number;

  // CRITICAL FIX: Add the index signature
  [propName: string]: unknown; // Allows any other string key with an unknown value
};

export type GetData = {
  Username: string;
  Email: string;
  Password: string;
};

export type GetItem = {
  ProductId: string;
  ProductName: string;
  ExpiredAt: Date;
  Quantity: number;
  SectionName: string;
  BranchId: string;
  BranchName: string;
  Location: string;
};

export type GetProducts = {
  ProductId: string;
  ProductName: string;
};

export type GetBranches = {
  BranchId: string;
  BranchName: string;
};

export type GetSection = {
  SectionId: number;
  SectionName: string;
};
