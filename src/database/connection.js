const ibmdb = require("ibm_db")

module.exports = async (app) => {
    const connStr = "DATABASE=cisserp;HOSTNAME=192.168.1.102;PORT=50000;PROTOCOL=TCPIP;UID=dba;PWD=overhead";
    process.env.DB2CODEPAGE = 1208;
    const db = ibmdb.open(connStr)

    return db
}
    
