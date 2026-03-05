require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.get('/api/health', (req, res) => res.json({status: 'ok'}))

// mount routes
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const submissionRoutes = require('./routes/submissions')
const paymentRoutes = require('./routes/payments')
const withdrawalRoutes = require('./routes/withdrawals')
const userRoutes = require('./routes/users')
const notificationRoutes = require('./routes/notifications')
const dashboardRoutes = require('./routes/dashboard')
const uploadRoutes = require('./routes/upload')

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/withdrawals', withdrawalRoutes)
app.use('/api/users', userRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes)

async function start(){
  try{
    if(process.env.MONGO_URI){
      await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
      console.log('MongoDB connected')
    } else {
      console.log('MONGO_URI not set; skipping DB connect')
    }
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))
  }catch(err){
    console.error(err)
    process.exit(1)
  }
}
start()
