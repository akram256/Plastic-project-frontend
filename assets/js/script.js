function questionaire(){
	fileUploader = name => {
		return `
			<input type="file" name="${name}" id="${name}" />
		`
	}

	let elements = DATA_ALL.map((data, index) => {
		let item
		if(index == 0){
			item = `<li class='active'>Stage ${data.title}</li>`
		}else{
			item = `<li>Stage ${data.title}</li>`
		}
		return item
	})

	let panel = `
		<ul id="progressbar">
            ${elements}
            <li>Final</li>
        </ul>
	`

	panel += DATA_ALL.map((data, index) => {
		let prev
		let nextName
		if (index == 0) {
			prev = ''
		}else{
			prev = `<input type="button" name="previous" class="previous action-button-previous" value="Previous"/>`
		}
		if(index == 5){
			nextName = 'Submit'
		}else{
			nextName = 'Next Stage'
		}

		return `
			<fieldset>
				<h1 class="fs-title">Stage ${data.title}</h1>
				<h2 class="fs-subtitle">${data.question}</h2>
				${fileUploader(data.title)}
            	${prev}
                <input type="button" name="submit" id="${nextName+'-content'}" class="next action-button" value="${nextName}"/>
			</fieldset>
		`
	}).join("")

	panel += `
		<fieldset>
            <h2 class="fs-title">Final Results</h2>
			<h3 class="fs-subtitle">Thank you for taking all steps</h3>
			<p>please, first reset the password to your email before you proceed.</p>
            <input type="button" name="submit" class="proceed-button action-button" value="Proceed"/>
        </fieldset>
	`
	return panel
}