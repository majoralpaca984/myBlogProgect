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

// putch 
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


// Commenti
// GET tutti i commenti
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un commento specifico
router.get('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST  aggiunge un commento a un post
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    const newComment = {
      userName: req.body.userName,
      text: req.body.text,
      rating: req.body.rating,
    };

    post.comments.push(newComment); 
    await post.save();

    // restituisco l'ultimo commento (quello appena aggiunto)
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// putch  modifica un commento
router.put('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });
    // Aggiorno solo i campi che sono stati passati nel body
    comment.userName = req.body.userName ?? comment.userName;
    comment.text = req.body.text ?? comment.text;
    comment.rating = req.body.rating ?? comment.rating;

    await post.save();

    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE  elimina un commento
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    comment.deleteOne(); 
    await post.save();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;
