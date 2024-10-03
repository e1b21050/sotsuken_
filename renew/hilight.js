function highlightLine(lineNumber) {
    editor.getSession().addGutterDecoration(lineNumber, 'highlight-line');
}

function removeHighlight(lineNumber) {
    editor.getSession().removeGutterDecoration(lineNumber, 'highlight-line');
    let markers = editor.getSession().getMarkers(false);
    for (let id in markers) {
        if (markers[id].clazz === 'highlight-line') {
            editor.getSession().removeMarker(markers[id].id);
        }
    }
}