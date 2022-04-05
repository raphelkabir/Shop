$('document').ready(function() {

    $('#form-register').submit(function(e) {
        e.preventDefault()
        
        const data = {
            email: $('#input-email').val(),
            password: $('#input-password').val()
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/auth/signup');
        xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && xhr.status == 200) {
              window.location = "/";
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    })
})