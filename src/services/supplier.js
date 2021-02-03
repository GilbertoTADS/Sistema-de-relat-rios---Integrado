module.exports = (app) => {
    const getByName = async (name) => {
        return await app.database.query.supplier.getByName(app.database.connection,name)
    }
    return {getByName}
}