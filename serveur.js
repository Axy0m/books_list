const express = require("express");
const server = express();
const morgan = require("morgan");
const routerLivre = require("./routeurs/livres.routeur");
const routerGlobal = require("./routeurs/global.routeur");
const routerAuteur = require("./routeurs/auteurs.routeur");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

mongoose.connect("mongodb://localhost/books_list", {useNewUrlParser:true,useUnifiedTopology:true});

// MIDDLEWARES 
server.use(express.static("public"))
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false}));
server.set('trust proxy', 1);

server.use((requete, reponse, suite) => {
    reponse.locals.message = requete.session.message;
    delete requete.session.message;
    suite();
})

server.use("/livres/",routerLivre);
server.use("/auteurs/",routerAuteur);

server.use("/",routerGlobal);

server.listen(3000);

