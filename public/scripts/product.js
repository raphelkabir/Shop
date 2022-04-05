$('document').ready(() => {
    $('#btn-buy').click(async function() {
        const currentUrl = window.location.href
        let index = 0
        for (index = currentUrl.length; index > 0; index--) {
            if (currentUrl[index] == '/') {
                break
            }
        }
        const productId = currentUrl.substring(index+1)
        const data = {
            productId: productId,
            count: 1
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/product/buy');
        xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && xhr.status == 200) {
              window.location = "/";
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
})