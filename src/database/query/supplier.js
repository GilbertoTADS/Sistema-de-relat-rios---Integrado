module.exports = (app) => {
    const getByName = async (db, name) => {
        const str = `SELECT * FROM CLIENTE_FORNECEDOR WHERE NOME LIKE '%${name}%' LIMIT 1,30`

       return await db.then( async(conn) => {
           return await conn.query(str)
        } )
    }
    return { getByName }
}