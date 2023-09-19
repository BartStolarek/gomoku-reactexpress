import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, {
    ...(options && options),
    algorithm: 'HS256',
    expiresIn: '8h',
  });
}

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const secret = process.env.JWT_SECRET as string;
    return jwt.verify(token, secret) as T;
  } catch (error) {
    return null;
  }
}
