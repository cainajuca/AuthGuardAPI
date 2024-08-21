import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // bcrypt manages salt internally
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(plainTextPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hash);
}