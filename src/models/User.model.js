import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    avatar: { type: String, default: '' },
    birthDate: { type: Date },
    province: { type: String, trim: true },
  },
  { timestamps: true },
)

// Nunca devolvemos el hash de la contraseña en las respuestas
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password
    delete ret.__v
    return ret
  },
})

export default mongoose.model('User', userSchema)
