getPadContents = () => {
    const getData = async id => {
        let response = await fetch(`http://kouritis.ddns.net:5520/code/${id}`);
        return await response.json();
    }

    (async () => {
        let data = await getData(location.hash.substring(1));
        let json = (data !== '[]') ? JSON.parse(data.slice(1, -1)) : undefined;

        if (json) {
            $('#src').val(json.Code);
            creator = json.Creator;
            editor.emptyResponse = false;
        } else {
            editor.emptyResponse = true;
        }
    })();
}

saveToDatabase = () => {
    const getData = async () => {
        let response = await fetch(`http://kouritis.ddns.net:5520/code`);
        return await response.json();
    }

    (async () => {
        const http = new XMLHttpRequest();
        let data = await getData();
        let type = (editor.emptyResponse || !location.hash) ? "POST" : "PUT";
        let id = (location.hash) ? location.hash.substring(1) : Number(JSON.parse(data.slice(1, -1).split(',').pop()).CodeID) + 1;

        http.open(type, `http://kouritis.ddns.net:5520/code/${id}`, true);
        http.send(JSON.stringify({"CodeID": id, "Code": $("#src").val().replace(/'/g, "\\'"), "Creator": creator}));

        if (!location.hash) {
            location.href = `${location.href.split('#')[0]}#${id}`;
            location.reload();
        }
    })();
}

forkCode = () => {
    const getData = async () => {
        let response = await fetch(`http://kouritis.ddns.net:5520/code`);
        return await response.json();
    }

    (async () => {
        const http = new XMLHttpRequest();
        let data = await getData();
        let newId = Number(JSON.parse(data.slice(1, -1).split(',').pop()).CodeID) + 1;

        http.open("POST", `http://kouritis.ddns.net:5520/code/${newId}`, true);
        http.send(JSON.stringify({"CodeID": newId, "Code": $("#src").val().replace(/'/g, "\\'"), "Creator": username}));

        location.href = `${location.href.split('#')[0]}#${newId}`;
        location.reload();
    })();
}

deleteCode = () => {
    const http = new XMLHttpRequest();

    http.open("DELETE", `http://kouritis.ddns.net:5520/code/${location.hash.substring(1)}`, true);
    http.send();

    location.href = location.href.split('#')[0];
}
