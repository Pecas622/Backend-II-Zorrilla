import passport from 'passport'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import {validatePassword, hashPassword} from '../utils/bcrypt.js'
import userModel from '../models/users.models.js'
import jwt from 'passport-jwt'

const localStrategy = local.Strategy //Defino la estrategia a implementar
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if(req.cookies) {
        token = req.cookies['Pecas622'] //Consulto especificamente esta cookie
    }
    return token
}

const initializatePassword = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const {first_name, last_name, email, password, age} = req.body
            const newUser = await userModel.create({
                first_name : first_name, 
                last_name: last_name, 
                email: email, 
                password: hashPassword(password), 
                age: age
            })
            return done(null, newUser) //Se ejecuto correctamente y envio al usuario
        } catch (e) {
            return done(e)
        }
    }))

    passport.use('login', new localStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
    
            const user = await userModel.findOne({email:username})
        
            if(validatePassword(password, user?.password)) {
                return done(null, user)
            } else {
                return done(null, false) //No hubo ningun error pero no se logueo mi usuario
            }
    
        } catch (e) {
            return done(e)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: "Iv23liHgIQzgXMKtuTwn",
        clientSecret: "bc51ad1429ecb70be41d7e7270f69156c2925f0b",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            
            let user = await userModel.findOne({email: profile._json.email})

            if(!user) { //Si no existe lo creo
                user = await userModel.create({
                    first_name: profile._json.name,
                    last_name: " ", //Valor por defecto
                    email: profile._json.email,
                    password: hashPassword("Pecas622"), //Valor por defecto
                    age: 18 //Valor por defecto
                })
            } 
            
            done(null,user) //Si existe lo logueo
            
        } catch (e) {
            console.log(e);
            done(e)       
        }
    }))
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "Pecas622"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (e) {
            return done(e)
        }
    }))

    //Pasos necesarios para generar una sesion y manejarnos via HTTP
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
} 

export default initializatePassword