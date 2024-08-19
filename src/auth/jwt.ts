import jwt from 'jsonwebtoken';

interface JwtPayload {
  email: string;
  username: string;
}

const secretKey = process.env.JWT_SECRET || 'CAINA-SEGREDO-ESCONDIDO'; // Usar variáveis de ambiente em produção

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    return null;
  }
}
