var global_image = new FormData(); // global variable to store image data

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
    xhr.send(global_image);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('resultado').hidden = false;
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            document.getElementById('download').hidden = false;
            document.getElementById('download').href = 'static/' + data['filename'];
        }
    }
}