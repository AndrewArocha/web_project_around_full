// middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  // 1. Extraer el encabezado Authorization
  const { authorization } = req.headers;

  // 2. Comprobar que exista y empiece con "Bearer "
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Se requiere autorización' });
  }

  // 3. Extraer solo el token
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // 4. Verificar el token. Si falla o expiró, jwt.verify lanzará un error
    payload = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return res.status(401).send({ message: 'Token inválido o expirado' });
  }

  // 5. Añadir el payload (que contiene el _id) al objeto Request
  req.user = payload as { _id: string };
  
  // 6. Pasar al siguiente middleware o controlador
  next();
};