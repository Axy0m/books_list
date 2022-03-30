var express = require("express");
var routeur = express.Router();
const twig = require("twig");
const livreController = require("../controllers/livre.controller");

/**
 * GESTION DES IMAGES
 */
const multer = require("multer");

// STOCKAGE DES IMAGES
const storage = multer.diskStorage({
    destination : (requete, file, cb)=> {
        cb(null, "./public/images/")
    },
    filename : (requete, file, cb)=> {
        var date = new Date().toLocaleDateString();
        cb(null, date+"-"+Math.round(Math.random() * 10000)+"-"+file.originalname)
    }
});

// TYPE DE FICHIERS ACCEPTES

const fileFilter = (requete, file, cb) =>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true)
    } else {
        cb(new Error("l'image n'est pas acceptée"),false)
    }
}

// TELECHARGEMENT DES IMAGES
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})

routeur.get("/", livreController.livres_affichage)
routeur.post("/", upload.single("image"), livreController.livres_ajout);
routeur.get("/:id", livreController.livre_affichage)
routeur.get("/modification/:id", livreController.livre_modification)
routeur.post("/modificationServer", livreController.livre_modification_validation)
routeur.post("/updateImage", upload.single("image"),livreController.livre_modification_validation_image )
routeur.post("/delete/:id", livreController.livre_suppression);

module.exports = routeur;