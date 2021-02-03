
module.exports = (app) => {

    app.route('/api/supplier/:name')
        .get(app.routes.supplier.getByName)
    
    app.route('/api/request/:request/:supplier/:dtInitial/:dtFinal')
        .get(app.routes.request.getAll)
    
    app.route('/api/products/:idRequest')
        .get(app.routes.products.getByIdRequest)
    
    app.route('/api/report/download/sherwin/:idRequest')
        .get(app.routes.report.getFileByIdRequest)

    return app
}
