// Define the structure of the object returned by the server action
export interface FormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}