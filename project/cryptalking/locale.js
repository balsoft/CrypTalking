async function getLocale () {
    var availableLocales = await (await fetch("./locales.json")).json()
    var userLocales = navigator.languages
    for (var i in userLocales) 
        for (var k in availableLocales)
            if (new RegExp(k, "g").test(userLocales[i])) return availableLocales[k]
    return availableLocales["en"]
}