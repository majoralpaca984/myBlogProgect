import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definizione dello schema per gli autori

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String },
  avatar: { type: String },
  password: { type: String, required: true } // 🔐 nuovo campo
});

//  Cripta la password prima di salvare
authorSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Metodo per confrontare la password inserita con quella salvata
authorSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};


const Author = mongoose.model("Author", authorSchema);
export default Author;