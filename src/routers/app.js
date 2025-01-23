import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.set('Cache-control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.render('pages/index', { time: Date.now() });
});

export default router;