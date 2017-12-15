

/**
 * @returns {Promise<{
    "title": String,
    "mainpage": String,
    "guidepage": String,
    "reload": String,
    "darktheme": String,
    "login": String,
    "createnick": String,
    "singin": String,
    "welcome": String,
    "usernamereserved": String,
    "error": String,
    "close": String,
    "connect": {
        "connect": "String,
        "connecttouserwithprovidednick": String,
        "usernotfound": String,
        "userwidthnicknotfound": String,
        "connectingtouser": String,
        "newconnectionheader": String,
        "newconnectionfromuser": String,
        "verificated": String,
        "notverificated": String
    },
    "accept": String,
    "decline": String,
    "waiting": String,
    "yourmessage": String,
    "error_critical": String
}}
 */
export async function getLocale () {
    var availableLocales = await (await fetch("./locales.json")).json()
    var userLocales = navigator.languages
    for (var i in userLocales) 
        for (var k in availableLocales)
            if (new RegExp(k, "g").test(userLocales[i])) return availableLocales[k]
    return cryptLocale
}