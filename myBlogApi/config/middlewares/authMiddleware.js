import jwt from 'jsonwebtoken';
import Author from '../models/authorModel.js';
import dotenv from 'dotenv';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token mancante' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await Author.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token non valido' });
  }
};

