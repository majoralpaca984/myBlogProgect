import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { storage } from '../config/cloudinary.js';
import Author from '../models/authorModels.js';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const authors = await Author.find(); 
    res.json(authors); 
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});


router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Autore non trovato' });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Autore non trovato' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Autore non trovato' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PATCH avatar upload
router.patch('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    console.log(req.file);
    const updated = await Author.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.path },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Registration utente
router.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json({ message: 'Utente registrato' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// login 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Author.findOne({ email });

  if (!user) return res.status(401).json({ message: 'Credenziali non valide' });

  const isValid = await user.comparePassword(password);
  if (!isValid) return res.status(401).json({ message: 'Credenziali non valide' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// GET /me - restituisce i dati dell'utente autenticato
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
