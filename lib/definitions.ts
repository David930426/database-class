// Define the structure of the object returned by the server action
export interface FormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export interface SessionPayload {
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
}