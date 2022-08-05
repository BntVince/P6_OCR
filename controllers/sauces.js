const fs = require('fs');
const Sauces = require('../models/Sauces.js');

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.addNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauces ajouté !' }))
        .catch(error => res.status(400).json({ error }));
};

const modifyObject = (object, req, res, next) =>  {
    Sauces.updateOne({ _id: req.params.id }, { ...object, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié' }))
        .catch(error => res.status(401).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject
    if (req.file) {
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
        delete sauceObject.userId;

        Sauces.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.userId === req.auth.userId) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        modifyObject(sauceObject, req, res, next);
                    });

                } else {
                    res.status(401).json({ message: 'Opération non-autorisé' })
                }
            })
            .catch(error => res.status(400).json({ error }));

    } else {
        sauceObject = {
            ...req.body
        };
        delete sauceObject.userId;

        Sauces.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.userId === req.auth.userId) {
                    modifyObject(sauceObject, req, res, next);
                } else {
                    res.status(401).json({ message: 'Opération non-autorisé' })
                }
            })
            .catch(error => res.status(400).json({ error }));

    }
};

exports.deleteSauces = (req, res, next) => {

    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId === req.auth.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                })
            } else {
                res.status(500).json({ message: 'Opération non-autorisé' })
            }
        })
        .catch(error => res.status(400).json({ error }));
};

const likeSauce = (object, req, res, next) =>  {
    Sauces.updateOne({ _id: req.params.id }, { $set: { ...object } })
        .then(() => {
            res.status(201).json({ message: 'Like modifié' })
        })
        .catch(error => res.status(400).json({ error }));
}

exports.addLikeToASauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const sauceObject = sauce;
            if (req.body.like == 1) {
                sauceObject.usersLiked.push(req.auth.userId);
                sauceObject.likes++;
                likeSauce(sauceObject, req, res, next);

            } else if (req.body.like == -1) {
                sauceObject.usersDisliked.push(req.auth.userId);
                sauceObject.dislikes++;
                likeSauce(sauceObject, req, res, next);

            } else {
                for (let i = 0; i < sauceObject.usersLiked.length; i++) {
                    if (sauceObject.usersLiked[i] == req.auth.userId) {
                        sauceObject.usersLiked.splice(i, 1);
                        sauceObject.likes--;
                        likeSauce(sauceObject, req, res, next);
                        break
                    }
                }
                for (let i = 0; i < sauceObject.usersDisliked.length; i++) {
                    if (sauceObject.usersDisliked[i] == req.auth.userId) {
                        sauceObject.usersDisliked.splice(i, 1);
                        sauceObject.dislikes--;
                        likeSauce(sauceObject, req, res, next);
                        break
                    }
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};

