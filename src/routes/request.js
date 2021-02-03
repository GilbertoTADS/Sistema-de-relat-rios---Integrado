module.exports = (app) => {

    const getAll = (req, res) => {
        let {request,supplier,dtInitial,dtFinal} = req.params

        app.services.request.getAll(request,supplier,dtInitial,dtFinal)
            .then( result => {
                res.status(200).json(result)})
    }

    return { getAll }
}