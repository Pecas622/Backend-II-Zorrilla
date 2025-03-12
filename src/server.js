import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import { create } from 'express-handlebars';
import path from 'path';
import initializatePassword from './config/passport.js';
import indexRouter from './routes/index.routes.js'
import __dirname from './path.js';

const app = express();
const PORT = 8080;
const hbs = create(); // Inicializa Handlebars

// Middlewares
app.use(express.json());
app.use(cookieParser("firmaSecreta"));

// Configuración de sesiones en MongoDB
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://santizorrilla:Pecas622@cluster0.eazxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 60
    }),
    secret: "sesionSecreta",
    resave: true,
    saveUninitialized: true
}));

// Conexión a MongoDB
mongoose.connect("mongodb+srv://santizorrilla:Pecas622@cluster0.eazxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB is connected"))
    .catch((e) => console.log(e));

// Inicializar Passport
initializatePassword();
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter)

// Servidor
app.listen(PORT, () => {
    console.log("Server on port:", PORT);
});
