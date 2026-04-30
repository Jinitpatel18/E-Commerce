import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

import app from './src/app.js'
import connectDB from './src/DB/index.js'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3000;
app.use(cookieParser())
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    })
})
.catch((error) => {
    console.log('Failed to connect to the database:', error.message);
})