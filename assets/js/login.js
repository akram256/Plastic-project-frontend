$(document).ready(function () {
    $('#msform').html(loginsection(false))
})

$(document).on('click', '#login-button', function(){
    if($(this).val() == 'Reset Password'){
        $('#msform').html(loginsection(true))
    }else{
        $('#msform').html(loginsection(false))
    }
})

$(document).on('click', '#confirm-button', function(){
    if($('#email').val() == '' || $('#password').val() == '' || $('#confirm').val() == ''){
        $('#email').before("<p class='error-msg'>No empty field is allowed.</p>")
    }else if($('#password').val() !== $('#confirm').val()){
        $('#email').before("<p class='error-msg'>Password mismatch</p>")
    }else{
        $('.loader-section').css("display", "block")
        $.ajax({
			type: "PUT",
			url: " http://127.0.0.1:8000/api/users",
			data: { email: $('#email').val(), password: $('#password').val() },
            dataType: "json",
            error: (xhr, status, error) => {
                let err = eval("(" + xhr.responseText + ")")
				err = err.message
                $('#email').before("<p class='error-msg'>"+ err +"</p>")
				$('.loader-section').css("display", "none")
            },
			success: data => {
                $('#email').before("<p class='error-msg success'>"+ data.message +"</p>")
				$('.loader-section').css("display", "none")
			}
		})
    }
    setTimeout(function(){
        $('.error-msg').remove()
    }, 3000)
})

$(document).on('click', '#login-user', function(){
    if($('#email').val() == '' || $('#password').val() == ''){
        $('#email').before("<p class='error-msg'>No empty field allowed.</p>")
    }else{
        $('.loader-section').css("display", "block")
        $.ajax({
			type: "POST",
			url: " http://127.0.0.1:8000/api/users/login",
			data: { email: $('#email').val(), password: $('#password').val() },
            dataType: "json",
            error: (xhr, status, error) => {
                let err = eval("(" + xhr.responseText + ")")
				err = err.message
                $('#email').before("<p class='error-msg'>"+ err +"</p>")
				$('.loader-section').css("display", "none")
            },
			success: data => {
                sessionStorage.setItem('email', $('#email').val())
                if(data.usertype === 'admin'){
                    window.location.href = 'questions.html'
                }else{
                    window.location.href = 'answer.html'
                }
                $('#email').before("<p class='error-msg success'>"+ data.message +"</p>")
				$('.loader-section').css("display", "none")
			}
		})
    }
    setTimeout(function(){
        $('.error-msg').remove()
    }, 3000)
})


function loginsection(bool) {
    let title, info, submit, value

    if(bool){
        title = 'Change'
        info = 'Please create password before accessing more information'
        value = 'Login'
        submit = `
            <input type="password" name="confirm"id='confirm' placeholder="Confirm Password"/>
            <input type="button" name="confirm" id='confirm-button' class="action-button" value="Confirm"/>
        `
    }else{
        title = 'Login'
        info = 'Please login to access more infomation'
        value = 'Reset Password'
        submit = `<input type="button" id="login-user" name="login" class="action-button" value="Login"/>`
    }

    return `
        <fieldset>
            <h2 class="fs-title">${title} Details</h2>
            <h3 class="fs-subtitle">${info}</h3>
            <input type="email" name="email" id="email" placeholder="Email"/>
            <input type="password" name="password" id='password' placeholder="Password"/>
            ${submit}
            <input type="button" id='login-button' name="login" class="action-button-previous" value="${value}"/>
        </fieldset>
    `
}

