const express = require('express')
const cors = require('cors')

const userRoutes = require('./routes/users')
const serviceRoutes = require('./routes/servicos')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/servicos', serviceRoutes)

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000')

