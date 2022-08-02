const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces.js');
const auth = require('../middleware/auth.js')
const multer = require('../middleware/multer-config.js')

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.addNewSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.addLikeToASauce);

module.exports = router;