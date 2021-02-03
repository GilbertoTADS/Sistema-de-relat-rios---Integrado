module.exports = (app) => {
    const getAll = async (db, request,supplier,dtInitial,dtFinal) => {
        const obj = Array()
        obj["request"] = request
        obj["supplier"] = supplier
        obj["dtInitial"] = dtInitial
        obj["dtFinal"] = dtFinal
      
        for(idx in obj){
            obj[idx] = app.shared.regex.removeSpace(obj[idx])
        }
        obj["dtInitial"] = obj["dtInitial"] !== 'void' ? app.shared.date.formatDate(obj["dtInitial"]) : obj["dtInitial"]    
        obj["dtFinal"] = obj["dtFinal"] !== 'void' ? app.shared.date.formatDate(obj["dtFinal"]) : obj["dtFinal"]
       
        let where = `WHERE pc.IDEMPRESA = 1`
        where = obj["dtFinal"] !== 'void' ? `${where} AND pc.DTMOVIMENTO <= Date('${obj["dtFinal"]}')` : where
        where = obj["dtInitial"] !== 'void' ? `${where} AND pc.DTMOVIMENTO >= Date('${obj["dtInitial"]}')`: where
        where = obj["request"]  !== 'void' ? `${where} AND pc.IDPEDIDO = '${obj["request"]}'`: where
        where = obj["supplier"] !== 'void' ? `${where} AND pc.IDCLIFOR = '${obj["supplier"]}'`: where
        console.log(where)
        const str = `SELECT 
                        pc.IDPEDIDO,
                        pc.DTMOVIMENTO,
                        cf.NOME,
                        SUM(pcv.VALDUPLICATA) AS TOTAL 
                    FROM 
                        PEDIDO_COMPRA AS pc 
                    FULL JOIN PEDIDO_COMPRA_VCTO pcv 
                    ON (pc.IDPEDIDO = pcv.IDPEDIDO ) FULL JOIN CLIENTE_FORNECEDOR AS cf 
                    ON ( cf.IDCLIFOR = pc.IDCLIFOR ) 
                    ${where} 
                    GROUP BY 
                        pc.IDPEDIDO,
                        cf.NOME,
                        pc.DTMOVIMENTO`

       return await db.then( async(conn) => {
           return await conn.query(str)
        } )
    }
    return { getAll }
}