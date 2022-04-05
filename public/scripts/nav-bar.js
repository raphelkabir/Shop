$('document').ready(() => {
    $('#search-form').submit(function(e) {
        e.preventDefault()
        const keywords = $("#input").val()
        if (keywords == undefined || keywords == '') {
            window.location.href = '/'
        } else {
            window.location.href = '/search/' + $("#input").val()
        }
    });
})