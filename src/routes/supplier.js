module.exports = (app) => {

    const getByName = (req, res) => {
        let { name } = req.params
        name = name.toUpperCase()

        app.services.supplier.getByName(name)
            .then( result => {
                res.status(200).json(result)})
    }

    return { getByName }
}