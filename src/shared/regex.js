module.exports = (app) => {

    const removeSpace = ( str ) => str.replace(/ /g,'')

    return { removeSpace }
}