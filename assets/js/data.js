let data = $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:8000/api/questions',
    async: false,
    dataType: 'json'
}).responseJSON

let DATA_ALL = data['data']
