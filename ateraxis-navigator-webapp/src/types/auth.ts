export type UserRole = 'navigator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}