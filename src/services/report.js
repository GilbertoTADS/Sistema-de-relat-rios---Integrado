module.exports = (app) => {

    const getFileByIdRequest = async (idRequest) => {
        return await app.database.query.report.sherwin.getFileByIdRequest(app.database.connection,idRequest)
    }
    return {getFileByIdRequest}
}