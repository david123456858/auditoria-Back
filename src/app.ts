import express, { Application, json, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { config } from './config/base'

const app: Application = express()

// middlewares
app.use(json())

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))

app.use(morgan('dev'))
app.disable('x-powered-by')

// rutas
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Señores la api del clima esta arriba' })
})

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By')
  next()
})

// Ports
app.listen(config.PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${config.PORT}`)
})
