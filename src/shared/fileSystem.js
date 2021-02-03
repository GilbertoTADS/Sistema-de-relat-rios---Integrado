const del = require('del')

module.exports = (app) => {
    app.deleteFile = del
    return { del } 
}