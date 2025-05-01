import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import BlogPost from '../models/blogPostModel.js';

const router = express.Router();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const posts = await BlogPost.find()
      .populate('author')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Post non trovato' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post non trovato' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// putch avatar
router.patch('/:id/cover', upload.single('cover'), async (req, res, next) => {
  try {
    console.log(req.file); 

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { cover: req.file.path }, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
