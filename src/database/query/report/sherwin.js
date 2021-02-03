module.exports = (app) => {
    const directory = './temp'
    let res;

    const fileError = async () => {
        const message = `Há campos obrigátórios que não foram preenchidos.\nPara gerar este relatório acesse os dados do pedido, verifique os que estão vazios e os preencha.\nFeito isso, tente novamente.`
        try{
            const res = await app.fs.appendFileSync(`${directory}/LEIA.txt`,message)
            console.log("file",res)
            return {response:'error',file:`${directory}/LEIA.txt`}
        }catch(err){
            return { response:err }
        } 
    }
    const verifyData = async (arr) => {
        for(let i =0;i<=arr.length-1;i++){
            for(idx in arr[i]){
                if(!arr[i][idx]){
                  const file = await fileError()
                  return file
                }
            }
        }
        return { response:'success'};
    }

    const getFileByIdRequest = async (db, idRequest) => {
        
        idRequest = idRequest.toString()
        const str = `SELECT
                        pc.IDPEDIDO,
                        pc.DTMOVIMENTO,
                        pc.HRMOVIMENTO,
                        cf.CNPJCPF,
                        e.CNPJ,
                        pcv.DTVENCIMENTO,
                        pcv.VALDUPLICATA,
                        COUNT(pcv.DTVENCIMENTO ) AS QUANTIDADE
                    FROM 
                        PEDIDO_COMPRA AS pc FULL JOIN CLIENTE_FORNECEDOR AS cf ON( pc.IDCLIFOR = cf.IDCLIFOR )
                        FULL JOIN EMPRESA AS e ON(e.IDEMPRESA = pc.IDEMPRESA)
                        FULL JOIN PEDIDO_COMPRA_VCTO AS pcv ON(pcv.IDPEDIDO = PC.IDPEDIDO)
                    WHERE 
                        pc.IDPEDIDO = '${idRequest}' AND pc.IDEMPRESA = '1'
                    GROUP BY 
                        pc.IDPEDIDO, pc.DTMOVIMENTO, pc.HRMOVIMENTO, cf.CNPJCPF, e.CNPJ, pcv.DTVENCIMENTO, pcv.VALDUPLICATA`

       const row1 = await db
            .then( async(conn) => {
                return await conn.query(str)
            } ).catch( err => console.log(err))

        res = await verifyData(row1)
        if(res.file) return res.file
        //Line One
        let lineOne = "019  001"
        let number_request = row1[0].IDPEDIDO
        number_request = number_request.toString().padStart(20,"0")
        let white20 = "                    "
        let date_request = row1[0].DTMOVIMENTO
        date_request = date_request.toString().replace(/-/g,"")
        let clock_request = row1[0].HRMOVIMENTO
        clock_request = clock_request.toString().replace(":","").substring(0,4)
        let date_clock_request = date_request+clock_request
        let white15 = "               "//2x
        let zero13 = "0000000000000"//4x
        let cnpjSupplier = row1[0].CNPJCPF
        let cnpjCompany = row1[0].CNPJ
        let white03 = "   "
        let white14 = "              "
        let white30 =  "                              "
        const CIF = "CIF"

        let lineOneFull = `${lineOne}${number_request}${white20}${date_clock_request}${date_clock_request}${date_clock_request}${white15}${white15}${zero13}${zero13}${zero13}${zero13}${cnpjSupplier}${cnpjCompany}${cnpjCompany}${cnpjCompany}${white03}${white14}${white30}${CIF}`
        
        //Line Two
        
        let lineTwo = '02'
        let installments = row1[0].QUANTIDADE <= 1 ? "1  " : "21 "
        let const5 = "5  "
        let const1 = "1  "
        let constCD = "CD  "

        //calcular a diferença de dias entre este e dtmovimento
        let dt_base = app.moment(row1[0].DTMOVIMENTO)
        let dt_expiration = app.moment(row1[0].DTVENCIMENTO)
        let dt_duration = app.moment.duration(dt_base.diff(dt_expiration))
        let days = dt_duration.asDays().toString().replace(/-/g,"").padStart(3,"0")
        let date_expiration_formated = row1[0].DTVENCIMENTO.toString().replace(/-/g,"")
        
        let duplicate_value =  row1[0].VALDUPLICATA.toString().replace(",","").padStart(15,"0")
        let percentage_payment = "00100"

        let lineTwoFull = `${lineTwo}${installments}${const5}${const1}${constCD}${days}${date_expiration_formated}${duplicate_value}${percentage_payment}`
        
        id_req = idRequest.padStart(13,"0")
        let file = `SHERWIN_001_${id_req}`         
        await app.fs.appendFileSync(`${directory}/${file}.txt`,`${lineOneFull}\n${lineTwoFull}`)
        //Line Four
        const str2 = `SELECT
                        pcp.IDPRODUTO,
                        pcp.QTDSOLICITADA,
                        pcp.VALUNITARIO,
                        pcp.VALIPI,
                        pcp.PERIPI,
                        pv.IDCODBARPROD,
                        pv.DESCRICAOPRODUTO,
                        SUM(pcp.VALUNITARIO*pcp.QTDSOLICITADA ) AS PROD_X_QUANT
                    FROM 
                        PEDIDO_COMPRA_PROD AS pcp 
                        FULL JOIN
                        PRODUTOS_VIEW AS pv
                        ON(pcp.IDPRODUTO = pv.IDPRODUTO)
                    WHERE pcp.IDPEDIDO = '${idRequest}' AND pcp.IDEMPRESA = '1'
                    GROUP BY 
                        pcp.IDPRODUTO,
                        pcp.QTDSOLICITADA,
                        pcp.VALUNITARIO,
                        pcp.VALIPI,
                        pcp.PERIPI,
                        pv.IDCODBARPROD,
                        pv.DESCRICAOPRODUTO`

       const row2 = await db
            .then( async(conn) => {
                return await conn.query(str2)
            } )

        res = await verifyData(row2)
        if(res.file) return res.file
            
        let lineFour = '04'
        let lineFourFull = []
        let count = 0
        let total_IPI = [], ipi = 0
        let total_perIPI = 0, perIPI
        let somatoria_total_IPI = 0
        let idx_items = []
        let idx_items2 = []
        let branco3 = "   "
        let EN = "EN "
        let barcodes = []
        let description_items = []
        let constanteEA = "EA "
        let multiplo_compra = "00001"
        let qtt_items = []
        let white05 = "     "
        let prod_x_quant = []
        let val_uni = []
        let sum_of_all_prod = 0, aux = 0
        let zero5 = "00000"
        let zero15 = "000000000000000"

        row2.forEach((val_current,index)=>{
            idx_items[index] = (index+1).toString().padStart(4,"0")
            idx_items2[index] = (index+1).toString().padStart(5,"0")
            barcodes[index] = row2[index].IDCODBARPROD.toString().padStart(14,"0")
            description_items[index] = row2[index].DESCRICAOPRODUTO.toString().padStart(41," ").substring(0,40)
            qtt_items[index] = row2[index].QTDSOLICITADA.toString().replace(/,/g,'').padStart(15,"0")
            prod_x_quant[index] = row2[index].PROD_X_QUANT.toString().replace(/,/g,'').padStart(15,"0")
            val_uni[index] = row2[index].VALUNITARIO.toString().replace(/,/g,'').padStart(15,"0")
            
            aux = aux + (parseFloat(row2[index].PROD_X_QUANT.replace(',','.')))
            sum_of_all_prod = aux.toFixed(2)

            ipi = row2[index].VALIPI.replace(',','')
            total_IPI[index] =  (parseInt(row2[index].QTDSOLICITADA.replace(',',''))*parseInt((ipi))).toString().padStart(15,"0")
            
            somatoria_total_IPI += parseInt(ipi)//dado da linha 9
            
            perIPI += parseInt(row2[index].PERIPI.replace(',',''))
            total_perIPI = perIPI.toString().padStart(5,"0")

            lineFourFull[index] = `${lineFour}${idx_items[index]}${idx_items2[index]}${branco3}${EN}${barcodes[index]}${description_items[index]}${white20}${constanteEA}${multiplo_compra}${qtt_items[index]}${zero15}${zero15}${white03}${zero5}`
        })

        lineFourFull.forEach(async (value, idx)=>{
            await app.fs.appendFileSync(`${directory}/${file}.txt`,`\n${lineFourFull[idx]}`)
        })

        //Line Nine
        let lineNine = '09'
        somatoria_total_IPI = somatoria_total_IPI.toString().padStart(15,'0')
        let sum_of_all_products = sum_of_all_prod.toString().replace('.','').padStart(15,'0')
        let sum_ipi_and_all_prod = ((parseInt(somatoria_total_IPI) + parseInt(sum_of_all_prod.toString().replace('.','')))).toString().padStart(15,'0')
        
        await app.fs.appendFileSync(`${directory}/${file}.txt`,`\n${lineNine}${somatoria_total_IPI}${sum_of_all_products}${zero15}${zero15}${zero15}${zero15}${zero15}${sum_ipi_and_all_prod}`)
        
        const nameFile = `SHERWIN_001_${idRequest.toString().padStart(13,'0')}.txt`
        const adressFile = `./temp/${nameFile}`
        return adressFile
    }
    return { getFileByIdRequest }
}