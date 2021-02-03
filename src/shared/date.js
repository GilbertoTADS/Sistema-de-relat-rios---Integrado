

module.exports = (app) =>{
    
    const formatDate = (date) => {
        let yyyyF = date.substring(0,4)
        let mmF = date.substring(4,6)
        let ddF = date.substring(6,8)
         return `${yyyyF}-${mmF}-${ddF}`
    }

    return {formatDate}
}