import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    text: { type: String, required: true },
  },
);

const blogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    cover: String,
    comments: [commentSchema], 
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
