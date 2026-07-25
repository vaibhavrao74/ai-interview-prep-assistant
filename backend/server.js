require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()
<<<<<<< HEAD
const PORT= process.env.PORT || 3000;
=======
const PORT = process.env.PORT || 3000
>>>>>>> 364be36 (Configure frontend API URL and update gitignore)


app.listen(PORT, () => {
    console.log("Server is running ")
})
