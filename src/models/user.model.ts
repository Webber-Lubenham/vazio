export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 