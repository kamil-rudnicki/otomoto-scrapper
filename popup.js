let json2Table = function(json) {
    let cols = Object.keys(json[0]);
    let headerRow = cols
        .map(col => `<th>${col}</th>`)
        .join("");
    let rows = json
        .map(row => {
        let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
        return `<tr>${tds}</tr>`;
        })
        .join("");
    const table = `
        <table>
            <thead>
                <tr>${headerRow}</tr>
            <thead>
            <tbody>
                ${rows}
            <tbody>
        <table>`;
    return table;
}

let generateCsv = function(json) {
    let cols = Object.keys(json[0]);

    let table = cols
        .map(col => `${col},`)
        .join("");
    table += '\n';

    let rows = json
        .map(row => {
            let tds = cols.map(col => (row[col] ? row[col].replace(/,/g, '-') : '') + ',').join("");
            return `${tds}\n`;
        })
        .join("");

    return table + rows;
}

document.addEventListener("DOMContentLoaded", function() {
    let table = document.getElementById('scrappedData');
    let backgroundWindow = chrome.extension.getBackgroundPage();
    let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?otomoto\.pl/;

    document.getElementById('scrapeData').addEventListener('click', () => {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            if (urlRegex.test(activeTab.url)) {
                chrome.tabs.sendMessage(activeTab.id, {text: 'report_back'}, function(domContent) {
                    let newRow = JSON.parse(domContent);
                    console.log('I received the following DOM content:\n');
                    console.log(newRow);
                    backgroundWindow.scrappedData.push(newRow);
                    table.innerHTML = json2Table(backgroundWindow.scrappedData); 
                });
            }
        });
    });

    document.getElementById('purgeTable').addEventListener('click', () => {
        backgroundWindow.scrappedData = [];
        table.innerHTML = ""; 
    });

    document.getElementById('getFile').addEventListener('click', () => {
        var hiddenElement = document.createElement('a');
        console.log(generateCsv(backgroundWindow.scrappedData));
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(generateCsv(backgroundWindow.scrappedData));
        hiddenElement.target = '_blank';
        hiddenElement.download = 'cars_table.csv';
        hiddenElement.click();
    });

    (function () {
        table.innerHTML = json2Table(backgroundWindow.scrappedData); 
    })();
});

