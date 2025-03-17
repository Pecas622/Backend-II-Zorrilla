import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import path from 'path'
import passport from 'passport'
import { create } from 'express-handlebars'
import initializatePassword from './config/passport.js'
import indexRouter from './routes/index.routes.js'
import __dirname from './path.js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080
const hbs = create()

app.use(express.json())
app.use(cookieParser(process.env.SECRET_KEY))

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 86400 // 1 día
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Solo en producción
        httpOnly: true,
        sameSite: "strict",
        name: 'Pecas622', // Cambiar el nombre de la cookie aquí
        // Puedes agregar más detalles aquí, como la duración de la cookie:
        maxAge: 1000 * 60 * 60 * 24 // 1 día de duración
    }
}))

// Añadir para ver si la cookie se está configurando correctamente
app.use((req, res, next) => {
    console.log("Session cookie:", req.cookies);
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB is connected"))
    .catch((e) => console.log("Error en la conexión a MongoDB:", e))

initializatePassword()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
