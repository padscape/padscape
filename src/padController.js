getPadContents = () => {
    const getData = async id => {
        let response = await fetch(`https://kouritis.ddns.net/code/${id}`);
        return await response.json();
    }

    (async () => {
        let data = await getData(window.location.hash.substring(1));
        let json = (data !== '[]') ? data[0] : undefined;

        if (json) {
            $('#src').val(json.Code);
            defaultText = json.Code;
            editor.highlight(defaultText);
            editor.showResult();
            creator = json.Creator;
            editor.emptyResponse = false;
        } else {
            editor.emptyResponse = true;
        }
    })();
}

saveToDatabase = () => {
    const http = new XMLHttpRequest();
    let type = ((editor.emptyResponse && !hasSaved) || !location.hash) ? "POST" : "PUT";
    let text = $("#src").val().replace(/"/g, "'");

    http.open(type, `https://kouritis.ddns.net/code/${(type === "PUT") ? window.location.hash.substring(1) : ""}`, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(`Code=${(text !== "") ? text : ' '}&Creator=${username}`);

    if (!location.hash) {
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                location.href = `${location.href.split('#')[0]}#${JSON.parse(http.responseText)['id']}`;
                location.reload();
            }
        }
    }
}

forkCode = () => {
    const http = new XMLHttpRequest();

    http.open("POST", `https://kouritis.ddns.net/code/`, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(`Code=${$("#src").val().replace(/"/g, "'")}&Creator=${username}`);

    http.onreadystatechange = () => {
        if (http.readyState == 4 && http.status == 200) {
            location.href = `${location.href.split('#')[0]}#${JSON.parse(http.responseText)['id']}`;
            location.reload();
        }
    }
}

deleteCode = () => {
    const http = new XMLHttpRequest();

    http.open("DELETE", `https://kouritis.ddns.net/code/${window.location.hash.substring(1)}`, true);
    http.send();

    location.hash = '';
    location.reload();
}
