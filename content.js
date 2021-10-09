// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        console.log("Getting data from current tab");

        //get url
        let data = [];
        data.url = window.location.toString();

        //get price
        let priceText = document.getElementsByClassName('offer-price__number')[0].innerText;
        let numb = priceText.match(/\d/g);
        numb = numb.join("");
        data.cena = numb;

        //get car attributes
        var params = []
        var elements = document.getElementsByClassName('offer-params__item');
        for (var i=0; i<elements.length; i++) {
            let name = elements[i].getElementsByClassName('offer-params__label')[0].innerText;
            let value = elements[i].getElementsByClassName('offer-params__value')[0].innerText;
            params.push({'name': name, 'value': value})
        }
        for (var i=0; i<params.length; i++) {
            if(params[i]['name'] === 'Marka pojazdu') data['marka'] = params[i]['value'];
            if(params[i]['name'] === 'Model pojazdu') data['model'] = params[i]['value'];
            if(params[i]['name'] === 'Generacja') data['generacja'] = params[i]['value'];
            if(params[i]['name'] === 'Wersja' && data['generacja'] === undefined) data['generacja'] = params[i]['value'];
            if(params[i]['name'] === 'Rok produkcji') data['rok'] = params[i]['value'];
            if(params[i]['name'] === 'Przebieg') data['przebieg'] = params[i]['value'];
            if(params[i]['name'] === 'Rodzaj paliwa') data['paliwo'] = params[i]['value'];
            if(params[i]['name'] === 'Skrzynia biegów') data['skrzynia'] = params[i]['value'];
            if(params[i]['name'] === 'Pojemność skokowa') data['pojemnosc'] = params[i]['value'];
            if(params[i]['name'] === 'Moc') data['moc'] = params[i]['value'];
            if(params[i]['name'] === 'Kolor') data['kolor'] = params[i]['value'];
            if(params[i]['name'] === 'Rodzaj koloru') data['kolor_rodzaj'] = params[i]['value'];
        }

        //get car addons
        var params = [];
        var ignore = ['szyby', 'abs', 'podusz', 'wspomagnie', 'aux', 'isofix', 'kierownic', 'immobi', 'asr', 'esp']
        var elements = document.getElementsByClassName('offer-features__item');
        for (var i=0; i<elements.length; i++) {
            let name = elements[i].innerText.toLowerCase();
            if (new RegExp(ignore.join("|")).test(name)) {
                // At least one match
            } else {
                params.push(name)
            }
        }
        data['dodatki'] = params.join(', ')

        //order fields
        let fieldsOrder = [
            'marka', 
            'model', 
            'cena', 
            'generacja', 
            'rok', 
            'przebieg', 
            'paliwo', 
            'skrzynia', 
            'pojemnosc', 
            'moc', 
            'kolor', 
            'kolor_rodzaj', 
            'dodatki', 
            'url', 
        ];
        let orderedRow = {};
        for (var i=0; i<fieldsOrder.length; i++) {
            orderedRow[fieldsOrder[i]] = data[fieldsOrder[i]];
        }

        sendResponse(JSON.stringify(orderedRow));
    }
});
