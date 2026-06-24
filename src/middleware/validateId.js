import mongoose from 'mongoose';

/**
 * Middleware que valida y limpia el :id de la URL antes de pasarlo a Mongoose.
 * Previene el error "Cast to ObjectId failed" por espacios o IDs malformados.
 */
export const validateId = (req, res, next) => {
  if (req.params.id) req.params.id = req.params.id.trim();
  if (req.params.galleryId) req.params.galleryId = req.params.galleryId.trim();
  if (req.params.photoId) req.params.photoId = req.params.photoId.trim();

  const id = req.params.id || req.params.galleryId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: `ID inválido: "${id}"` });
  }
  next();
};
