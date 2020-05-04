makePanes = () => {
    $('.gutter').remove();

    let pane = new Split(["#codeCol", "#resultCol"], {
        direction: split,
        sizes: [50, 50],
        minSize: [300, 300],
        gutterSize: 6,
        cursor: `${(split === 'horizontal') ? 'col' : 'row'}-resize`
    });
};

positionPanes = () => {
    // Adjust the width of the textarea

    if (split === 'horizontal') {
        $('#codeCol, #resultCol').css('height', '100%');

        $('#src, .code-output').css({
            'width': `calc(${$('#codeCol').css('width')} - 15px)`,
            'height': '100%'
        });
    } else {
        $('#codeCol, #resultCol').css('width', '100%');

        $('#src, .code-output').css({
            'height': `calc(${$('#codeCol').css('height')} + 52px)`,
            'width': '100%'
        });
    }

    positionButtons();
};

updateSplit = direction => {
    if (split === direction) {
        return;
    }

    split = direction;
    localStorage.padscapeLayout = split;

    makePanes();
    positionPanes();
}

window.onresize = () => {
    positionPanes();
};

$('.size-plus-btn').off().on('click', () => {
    // Increase the font size
    if (typeof textSize !== 'number') {
        textSize = parseInt(textSize);
    }

    if (textSize < 55) {
        textSize += 2;
        $(':root').css('--text-size', `${textSize}px`);
        localStorage.padscapeTextSize = textSize;
        Prism.highlightAll();
    }

    $('#src, .code-output').css('padding-left', `${textSize / 16 + 2}rem`);
});

$('.size-minus-btn').off().on('click', () => {
    // Decrease the font size
    if (typeof textSize !== 'number') {
        textSize = parseInt(textSize, 10);
    }

    if (textSize > 2) {
        textSize -= 2;
        $(':root').css('--text-size', `${textSize}px`);
        localStorage.padscapeTextSize = textSize;
        Prism.highlightAll();
    }

    $('#src, .code-output').css('padding-left', `${textSize / 16 + 2}rem`);
});

positionButtons = () => {
    // Position the element correctly
    let xPosition = $('#src').css('width');
    let yPosition = parseInt($('#src').css('height').slice(0, -2));

    $('.size-plus-btn').css({
        'left': `calc(${xPosition} - 70px)`,
        'top': `${Math.min(yPosition, window.innerHeight) - 50}px`
    });

    $('.size-minus-btn').css({
        'left': `calc(${xPosition} - 119px)`,
        'top': `${Math.min(yPosition, window.innerHeight) - 50}px`
    });
};

$(document).ready(() => {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            // When the container is resized
            positionPanes();
        });
    });
    
    observer.observe($('#codeCol')[0], {
        attributes: true,
        attributeFilter: ['style']
    });
    
    makePanes();
    positionPanes();
    $(':root').css('--text-size', `${textSize}px`);
});
