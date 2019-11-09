$(document).ready(function () {
    answersection()
})

function answersection(){
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
                        <li><a href="questions.html">Questions</a></li>
                        <li><a href="answer.html">Answers</a></li>
                    </ul>
                    <button class="logout-button">Logout</button>
                </div>
            `)
            admindata()
            $('.loader-section').css("display", "none")
        }else if(data.user[0].usertype === 'user'){
            userdata(sessionStorage.getItem('email'))
            $('.loader-section').css("display", "none")
        }
    })
}

function userdata(email){
    $('.loader-section').css("display", "block")
    fetch(`http://127.0.0.1:8000/api/answers/${email}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.status){
            $('#msform').html(`
                <fieldset>
                    <h2 class='fs-title'>Answer Section</h2>
                    <h3 class='fs-subtitle'>This section will display your results</h3>    
                    <canvas id='doughnut-chart' width='1000' height='350'></canvas>
                    <br/>
                    <p><button type='button' class='action-button logout-button'>Logout</button></p>
                </fieldset>
            `)
            new Chart(document.getElementById("doughnut-chart"), {
                type: 'doughnut',
                data: {
                  labels: ["Wrong", "Correct"],
                  datasets: [
                    {
                      label: "Your Results",
                      backgroundColor: ["#C5C5F1", "#3e95cd"],
                      data: [(100 - data.answer.results), data.answer.results]
                    }
                  ]
                },
                options: {
                  title: {
                    display: false,
                    text: ''
                  }
                }
            });
        }else{
            $('#msform').html(`
                <fieldset>
                    <h2 class='fs-title'>Answer Section</h2>
                    <h3 class='fs-subtitle'>This section will display your results</h3>
                    <p>${data.message}</p>
                    <p><button type='button' class='action-button logout-button'>Logout</button></p>
                </fieldset>
            `)
        }
    })
    $('.loader-section').css("display", "none")
}

$('body').on('click', '.logout-button', function(){
    sessionStorage.clear()
    window.location.href = 'login.html'
})

$('body').on('click', '.view-button', function(){
    let results = prompt('Award marks to this student')

    if(isNaN(results)){
        alert('Only integers are allowed')
    }else if(results == '' || results == null){
        alert('No empty field is allowed')
    }else{
        let id = $(this).next().val()
        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:8000/api/answers",
            data: { id: id, results: parseInt(results) },
            dataType: "json",
            success: data => {
                location.reload(true)
            }
        })
    } 
})

$('body').on('click', '.marks-button', function(){
    $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:8000/api/answers",
        data: { id: $('#marks-id').val(), results: parseInt($('#marks').val()) },
        dataType: "json",
        success: data => {
            location.reload(true)
        }
    })
})

function admindata(){
    fetch(`http://127.0.0.1:8000/api/answers`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        let datatable = ''
        data.answers.map((data, index) => {
            let upper = ''
            let lower = ''
            
            for([item, value] of Object.entries(data.uploads)){
                upper += `<td style='text-align:center;'>${item}</td>`
                lower += `<td style='text-align:center;'>
                    <a target='_blank' href='http://127.0.0.1:8000/${value}'><i class='fa fa-download'></i></a>
                </td>`
            }
            
            let inner_table = `
            <table border='1'>
                <tr>${upper}</tr>
                <tr>${lower}</tr>
            </table>
            `

            datatable += `
            <tr>
                <td>${++index}</td>
                <td>${data.fullname}</td>
                <td>${inner_table}</td>
                <td style='text-align:center;'>${data.results}</td>
                <td>
                    <button type='button' class='action-button view-button'>Award Marks</button>
                    <input type='hidden' value='${data.answer_id}' />
                </td>
            </tr>
            `
        })
    
        $('#msform').html(`
        <fieldset>
        <table class='table'>
            <thead>    
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Uploads</th>
                    <th>Percentage(%)</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${datatable}
            </tbody>
        `)
    })
}