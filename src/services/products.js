module.exports = (app) => {

    const getByIdRequest = async (idRequest) => {
        return await app.database.query.products.getByIdRequest(app.database.connection,idRequest)
    }
    return {getByIdRequest}
}