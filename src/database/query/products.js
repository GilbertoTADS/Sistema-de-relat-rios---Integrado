module.exports = (app) => {
    const getByIdRequest = async (db, idRequest) => {
        const str = `SELECT 
                        pcp.IDPRODUTO, 
                        pv.DESCRICAOPRODUTO, 
                        pcp.QTDSOLICITADA, 
                        pcp.VALUNITARIO,
                        pcp.VALTOTLIQUIDO
                    FROM
                        PEDIDO_COMPRA_PROD AS pcp
                    FULL JOIN 
                        PRODUTOS_VIEW AS pv
                            ON(pcp.IDPRODUTO = pv.IDPRODUTO)
                    WHERE
                        pcp.IDPEDIDO = '${idRequest}' AND IDEMPRESA = '1'`

       return await db.then( async(conn) => {
           return await conn.query(str)
        } )
    }
    return { getByIdRequest }
}