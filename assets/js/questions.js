$(document).ready(function () {
    questionrenderer()
})

function questionrenderer(){
    $('.loader-section').css("display", "block")
    fetch(`http://127.0.0.1:8000/api/users/${sessionStorage.getItem('email')}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(!data.user){
            window.location.href = 'login.html'
            $('.loader-section').css("display", "none")
        }else if(data.user[0].usertype === 'admin'){
            $('.navigation').html(`
                <div class='navbar'>
                    <ul>
                        <li><a href="questions.html">Stages</a></li>
                        <li><a href="answer.html">Answers</a></li>
                    </ul>
                    <button class="logout-button">Logout</button>
                </div>
            `)
            $('#msform').html(questionsection(0, '', '', 'Add'))
            $('.loader-section').css("display", "none")
        }else if(data.user[0].usertype === 'user'){
            window.location.href = 'login.html'
            $('.loader-section').css("display", "none")
        }
    })
}

$(document).on('click', '.addquestion', function(){
    if($('#title').val() === '' || $('#question').val() === ''){
        $('#title').before("<p class='error-msg'>No empty fields allowed</p>")
    }else{
        let method;
        let data;
        if($(this).val() === 'Add'){
            method = 'POST'
            data = { email: sessionStorage.getItem('email'), title: $('#title').val(), question: $('#question').val() }
        }else{
            method = 'PUT'
            data = { email: sessionStorage.getItem('email'), title: $('#title').val(), question: $('#question').val(), id: $('#question_id').val() }
        }

        $('.loader-section').css("display", "block")
        $.ajax({
            type: method,
            url: " http://127.0.0.1:8000/api/questions",
            data: data,
            dataType: "json",
            error: (xhr, status, error) => {
                let err = eval("(" + xhr.responseText + ")")
                err = err.message
                if(typeof(err) === 'object'){
                    err = err[Object.keys(err)[0]];
                }
                
                $('#title').before("<p class='error-msg'>"+ err +"</p>")
                $('.loader-section').css("display", "none")
            },
            success: data => {
                $('#msform').html(questionsection(0, '', '', 'Add'))
                $('#title').before("<p class='error-msg success'>"+ data.message +"</p>")
                $('.loader-section').css("display", "none")
            }
        })
    }
    setTimeout(function(){
        $('.error-msg').remove()
    }, 3000)
})

$('body').on('click', '#delete-question', function(){
    $('.loader-section').css("display", "block")
    let value = $(this).next().val()
    $.ajax({
        type: "DELETE",
        url: "http://127.0.0.1:8000/api/questions",
        data: { email: sessionStorage.getItem('email'), id: parseInt(value) },
        dataType: "json",
        error: (xhr, status, error) => {
            let err = eval("(" + xhr.responseText + ")")
            err = err.message
            $('#title').before("<p class='error-msg'>"+ err +"</p>")
            $('.loader-section').css("display", "none")
        },
        success: data => {
            $('#msform').html(questionsection(0, '', '', 'Add'))
            $('#title').before("<p class='error-msg success'>"+ data.message +"</p>")
            $('.loader-section').css("display", "none")
        }
    })
    setTimeout(function(){
        $('.error-msg').remove()
    }, 3000)
})

$('body').on('click', '.logout-button', function(){
    sessionStorage.clear()
    window.location.href = 'login.html'
})

$('body').on('click', '#edit-question', function(){
    let question = $(this).parent().prev()
    let title = question.prev()
    let id = $(this).next().next().val()

    $('#msform').html(questionsection(id, title.text(), question.text(), 'Update'))
})

function questionsection(id, title, question, add) {

    return `
        <fieldset>
            <h2 class="fs-title">Stage Section</h2>
            <h3 class="fs-subtitle">This section handles all content of questions.</h3>
            <input type='hidden' id='question_id' value='${id}' />
            <input type="text" name="title" value='${title}' id='title' placeholder="Stage Title"/>
            <textarea rows='10' id='question' placeholder='Please, enter your question here...'>${question}</textarea>
            <div id='qns-btns'>
                <input type="button" name="login" class="action-button addquestion" value='${add}'/>
                <input type="button" name="login" class="action-button-previous cancelquestion" value="Close"/>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Question</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${getQuestions()}
                </tbody>
            </table>
        </fieldset>
    `
}

function getQuestions(){
    $('.loader-section').css("display", "block")
    let results = ''
    let questions = $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/api/questions',
        async: false,
        dataType: 'json'
    }).responseJSON

    for(let i = 0; i < questions['data'].length; ++i){
        results += `
            <tr>
                <td>${i+1}</td>
                <td>${questions['data'][i]['title']}</td>
                <td>${questions['data'][i]['question']}</td>
                <td>
                    <button type='button' id='edit-question'  class='action-button'>edit</button>
                    <button type='button' id='delete-question' class='action-button-previous'>delete</button>
                    <input type='hidden' value="${questions['data'][i]['question_id']}" />
                </td>
            </tr>
        `
    }
    $('.loader-section').css("display", "none")
    return results
}