var current_fs, next_fs, previous_fs;
var left, opacity, scale;
var animating;
let isRegistered = sessionStorage.getItem('registered')

$(document).ready(function(){

	if(isRegistered){
		$('#msform').html(questionaire())
	}else{
		$('#msform').html(registerForm())
	}

	$('#register').click(function(){
		$('.loader-section').css("display", "none")
		sessionStorage.setItem('registered', true)
		sessionStorage.setItem('email', $('#email').val())
		location.reload(true)
		$('#msform').html(questionaire())
	})

	
	$(".next").click(function(){
		let isEmpty = false
		let input2 = $(this).parent().children('input')
		
		input2.each((index, element) => {
			let value = $(element).val()
			if(value === '')
				isEmpty = true
		})
		if(isEmpty){
			$('.fs-subtitle').after("<p class='error-msg'>No empty field is allowed</p>")
			setTimeout(() => {
				$('.error-msg').remove()
			}, 3000)
			return
		}
		
		if($(this).val() === 'Get Started'){
			let input = {
				fullname: $('#fullname').val(),
				contact: $('#contact').val(),
				email: $('#email').val(),
				students_number: $('#students_number').val(),
				field_of_study: $('#field_of_study').val(),
				institution: $('#institution').val(),
				password: $('#password').val(),
				usertype: 'user',
			}

			$.ajax({
				type: "POST",
				url: " http://127.0.0.1:8000/api/users/signup",
				data: input,
				dataType: "json",
				async: false,
				error: (xhr, status, error) => {
					let err = eval("(" + xhr.responseText + ")")
					err = err.message
					let errorMsg = err[Object.keys(err)[0]];

					$('.fs-subtitle').after("<p class='error-msg'>"+ errorMsg +"</p>")		
					$('.loader-section').css("display", "none")
				},
				success: data => {
					// do something
				}
			})
			if($('.error-msg').text() !== ''){
				setTimeout(function(){
					$('.error-msg').remove()
				}, 3000)
				return false
			}	
		}

		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
	        'transform': 'scale('+scale+')',
	        'position': 'absolute'
	      });
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$('#Submit-content').on('click', function(){
		let form = new FormData()
		fetch('http://127.0.0.1:8000/api/questions', {
			method: 'GET'
		})
		.then(respose => respose.json())
		.then(data => {
			data.data.map((results, index) => {
				form.append(`${results.title}`, $(`#${results.title}`).prop('files')[0])
			})
			form.append('email', sessionStorage.getItem('email'))
			
			fetch('http://127.0.0.1:8000/api/answers', {
				method: 'post',
				body: form
			})
			.then(response => response.json())
			.then(data => {
				// console.log(data)
			})
		})
	})

	$('.proceed-button').click(function(){
		window.location.href = 'login.html'
	})
})

function registerForm(){
	let form = `
		<fieldset>
            <h2 class="fs-title">Personal Details</h2>
            <h3 class="fs-subtitle">Tell us something more about you</h3>
            <input type="text" name="fullname" id="fullname" placeholder="Full Name"/>
            <input type="text" name="contact" id='contact' placeholder="Phone"/>
            <input type="text" name="email" id='email' placeholder="Email"/>
            <input type="text" name="students_number" id='students_number' placeholder="Students Number"/>
            <input type="text" name="field_of_study" id='field_of_study' placeholder="Field of Study"/>
            <input type="text" name="institution" id='institution' placeholder="Institution"/>
            <input type="password" name="password" id='password' placeholder="Password (must have atleast one - digit, uppercase, lowercase, min 6 char)"/>
            <input type="button" name="start" class="next action-button" value="Get Started"/>
		</fieldset>

		<fieldset>
			<h2 class="fs-title">Instructions</h2>
			<h3 class="fs-subtitle">Please download the doc below and read the instructions.</h3>
			<div class='icon-section'>
				<i class='fa fa-file-word-o fa-5x'>
					<a href='assets/docs/Electric_fence_energizer_circuit.docx' class='download-button'>
						<i class='fa fa-download'></i>
						download
					</a>
				</i>
			</div>
			<input type="button" name="previous" class="previous action-button-previous" value="Previous"/>
			<input type="button" name="start" class="next-mod action-button" id="register" value="Proceed"/>
		</fieldset>
	`
	return form
}
