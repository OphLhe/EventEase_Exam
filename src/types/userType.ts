export type Role = "admin" | "member" | "volunteer";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};
