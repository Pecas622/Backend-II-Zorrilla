import { Router } from "express"
import cartsRouter from "./carts.routes.js"
import productRouter from "./products.routes.js"
import sessionsRouter from "./sessions.routes.js"
import usersRouter from "./users.routes.js"

const indexRouter = Router()

// Ruta para la página de inicio (Home)
indexRouter.get('/', (req, res) => {
    res.render('home')  // Renderiza home.handlebars
})

indexRouter.use('/api/users', usersRouter)
indexRouter.use('/api/sessions', sessionsRouter)
indexRouter.use('/api/carts', cartsRouter)
indexRouter.use('/api/products', productRouter)
indexRouter.use('*', (req, res) => {
    res.status(404).send("Ruta no encontrada")
})

export default indexRouter
