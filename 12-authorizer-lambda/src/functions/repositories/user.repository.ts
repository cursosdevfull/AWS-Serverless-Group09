export interface UserRepository {
  createUser(email: string, password: string, name: string): Promise<any>;
  getUserByEmail(email: string): Promise<any[]>;
}
