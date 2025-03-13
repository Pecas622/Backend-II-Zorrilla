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

const app = express()
const PORT = 8080
const hbs = create()

app.use(express.json())
app.use(cookieParser("firmaSecreta"))
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://santizorrilla:Pecas622@cluster0.eazxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 60
    }),
    secret: "sesionSecreta",
    resave: true,
    saveUninitialized: true
}))

mongoose.connect("mongodb+srv://santizorrilla:Pecas622@cluster0.eazxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB is connected"))
.catch((e) => console.log(e))

initializatePassword()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log("Server on port", PORT);
    
})