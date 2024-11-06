var global_image = new FormData();

function call_https_request(from) {
    var url = 'http://0.0.0.0:8080/';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
        }
    }
    xhr.send();
}

function showImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    var fileformat;
    reader.onload = function(e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('preview').hidden = false;
        fileformat = file.name.split('.').pop().toLowerCase();

        // hide label that is the same format as the image
        var labelFormats = document.getElementById('selectorformat').getElementsByTagName('label');
        for (var i = 0; i < labelFormats.length; i++) {
            if (labelFormats[i].value == fileformat) {
                labelFormats[i].disabled = true;
                labelFormats[i].checked = false;
            }
        }
        global_image.append('image', file);
    };
    reader.readAsDataURL(file);
}