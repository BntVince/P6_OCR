const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces.js');

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', saucesCtrl.getOneSauce);
router.post('/', saucesCtrl.addNewSauce);
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauces);
router.post('/:id/like', saucesCtrl.addLikeToASauce);

module.exports = router;