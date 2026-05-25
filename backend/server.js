import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import { testAi } from "./src/service/ai.service.js"

const PORT = process.env.PORT || 8000

testAi()

connectToDB().catch((err)=>{
    console.error("mongodb connection failed : ",err)
    
})

app.listen(PORT,()=>{
    console.log("server is running on port 3000")
})