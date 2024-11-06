var global_image = new FormData(); // global variable to store image data
const local_host = 'localhost' // default: window.location.origin

console.log(window.location.origin)


function call_https_request(from) { // basic function to call the server
    var url = window.location.origin;
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

function showImage(event) { // show image preview
    const file = event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const fileSizeError = document.getElementById('fileSizeError');

    if (file.size > maxSize) {
        fileSizeError.hidden = false;
        document.getElementById('convertButton').disabled = true;
        return;
    } else {
        fileSizeError.hidden = true;
    }

    const reader = new FileReader();
    var fileformat;
    reader.onload = function(e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('preview').hidden = false;
        fileformat = file.name.split('.').pop().toLowerCase();

        // hide label that is the same format as the image
        var labelFormats = document.getElementsByClassName('selectorformat');
        
        for (var i = 0; i < labelFormats.length; i++) {
            if (labelFormats[i].value === fileformat) {
                labelFormats[i].disabled = true;
                labelFormats[i].checked = false;
            }
        }
        global_image.append('image', file);
        document.getElementById('convertButton').disabled = false;
    };
    reader.readAsDataURL(file);
}

function sendImage() { // send image to server
    var url = window.location.origin + '/convert'; // server url
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('resultado').hidden = false;
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            document.getElementById('image').src = '/static/converted/' + data['filename'];
            document.getElementById('download').value = 'Descargar ' + data['filename'];
            document.getElementById('download').hidden = false;
            document.getElementById('download').href = '/static/converted/' + data['filename'];
        }
    };
    document.getElementById('download').value = 'Cargando...'; // disable button

    // Create FormData and append the image and format
    var formData = new FormData();
    formData.append('image', global_image.get('image'));
    formData.append('format', document.querySelector('input[name="format"]:checked').value);

    xhr.send(formData); // send the FormData object
    console.log(formData);
}