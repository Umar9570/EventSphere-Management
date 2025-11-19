const{default: mongoose} = require('mongoose')

async function ConnectDB(){
    try {
        await mongoose.connect(process.env.DBURI)
        console.log("Connected to DB...")
    } catch (error) {
        console.log("Connection Failed...")
    }
}

module.exports = ConnectDB