const bodyParser = require('body-parser')
const cors =  require('cors')

 
module.exports = (app) => {
    
    app.use(bodyParser.json())
    app.use(cors())
    const corsOptions = {
        origin: 'http://localhost:4200',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))



    return app
}