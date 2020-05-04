getPadContents = id => {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: `https://kouritis.ddns.net/code/${id}`,
            success: resolve,
            error: reject
        });
    });
};

saveToDatabase = () => {
    let requestType = ((emptyResponse && !hasSaved) || !location.hash) ? "post" : "put";
    let text = $("#src").val();

    $.ajax({
        url: `https://kouritis.ddns.net/code/${(requestType === 'put') ? window.location.hash.substring(1) : ''}`,
        type: requestType,
        data: `Code=${(text !== '') ? text : ' '}&Creator=${username}&Libraries=${JSON.stringify(libs)}`,
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: data => {
            if (requestType === 'post') {
                location.href = `${location.href.split('#')[0]}#${data['id']}`;
                location.reload();
            }
        }
    });
};

forkCode = () => {
    $.ajax({
        url: 'https://kouritis.ddns.net/code/',
        type: 'post',
        data: `Code=${$("#src").val()}&Creator=${username}&Libraries=${JSON.stringify(libs)}`,
        contentType: 'application/x-www-form-urlencoded',
        success: data => {
            location.href = `${location.href.split('#')[0]}#${data['id']}`;
            location.reload();
        }
    });
};

deleteCode = () => {
    $.ajax({
        url: `https://kouritis.ddns.net/code/${window.location.hash.substring(1)}`,
        type: 'delete',
        dataType: 'json',
        success: data => {
            location.hash = '';
            location.reload();
        }
    });
};

$('#save').click(() => {
    hasSaved = true;

    if (creator === username) {
        saveToDatabase();
    } else {
        forkCode();
    }
});

$('#src').on('keyup keydown', () => {
    if (autosave === 'on') {
        hasSaved = true;

        if (!location.hash) {
            localStorage.defaultText = $('#src').val();
        } else if (creator === username) {
            saveToDatabase();
        }
    }
});

$(document).on('keydown', e => {
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();

        if (!location.hash) {
            localStorage.defaultText = $('#src').val();
        } else if (creator === username) {
            saveToDatabase();
        }
    }
});
