import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dataDiNascita: { type: String },
    avatar: { type: String }
});
  
const Author = mongoose.model("Author", authorSchema);
export default Author;