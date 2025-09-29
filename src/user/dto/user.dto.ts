import { Role } from '@prisma/client';

export class UserRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}
