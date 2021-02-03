module.exports = (app) => {

    const getByIdRequest = (req, res) => {
        let { idRequest } = req.params
        app.services.products.getByIdRequest(idRequest)
            .then( result => {
                res.status(200).json(result)})
    }
    

    return { getByIdRequest }
}