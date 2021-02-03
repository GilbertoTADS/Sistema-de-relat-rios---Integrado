module.exports = (app) => {

    const getAll = async (request,supplier,dtInitial,dtFinal) => {
        return await app.database.query.request.getAll(app.database.connection,request,supplier,dtInitial,dtFinal)
    }
    return {getAll}
}