import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/imagen', protect, restrictTo('admin', 'operador'), upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

export default router;
