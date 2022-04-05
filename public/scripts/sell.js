$('document').ready(() => {
    $('#form-product').submit(async (e) => {
        e.preventDefault()
        const data = {
            name: $("#product-name").val(),
            description: $("#product-description").val(),
            price: parseFloat($("#product-price").val()),
            stock: parseInt($("#product-stock").val())
        }
        await sell(data)
    });  
})

async function sell(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/product/sell');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

