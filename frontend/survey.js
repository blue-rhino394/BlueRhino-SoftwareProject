class Survey {

	constructor(){
		this.pages = this.getPages();
		this.pageIndex = 0;
		this.currentPage = this.pages[this.pageIndex];
		this.animating = false;
	}

	start(){
		this.setContent();
	}

	async selected(result){
		let valid = await this.currentPage.validate(result);
		if(valid==true){
			this.currentPage["answer"] = result;
			this.nextPage();
		}else{
			$("#error").text(valid);
		}
	}

	//makes jquery post requests awaitable
	async post(endpoint, json){
		return new Promise(resolve => {
    		$.post(`/api/${endpoint}`, json, (data) => {resolve(data)});
  		});
	}

	nextPage(){
		this.pageIndex += 1;
		this.currentPage = this.pages[this.pageIndex];

		
		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "+="+((window.screen.width)) }, 1000, "easeInCubic", () => {
			this.setContent();

			content.css("left", `-${content.width()*2}px`);
			content.animate({ "left": "0px" }, 1000, "easeOutCubic", () => {
				this.animating = false;
			});
		});

	}

	getInput(inputType){
		let inputs = {
			question: $("<input/>", {
				"class": "surveryQuestion", 
				type: "text",
				
				placeholder: "Type your answer and press enter",
				on: {
					keypress: (e) => {
						if(e.which === 13 && !this.animating) this.selected($(e.target).val());
					}
				}
			}),
			password: $("<input/>", {
				"class": "surveryQuestion", 
				type: "password",
				placeholder: "Type your answer and press enter",
				on: {
					keypress: (e) => {
						if(e.which === 13 && !this.animating) this.selected($(e.target).val());
					}
				}
			})
		}
		return inputs[inputType];
	}

	setContent(){

		$("#content").html([
			$("<h1/>").text(this.currentPage.question),
			$("<span/>").attr("id", "error").css("color", "red").css("opacity", "0.8"),
			this.getInput(this.currentPage.type),
		]);
	}

	getPages(){
		
	}



}

class RegisterSurvey extends Survey{

	constructor(){
		super();
	}

	validEmail(email) 
	{
		let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return email.match(mailformat);

	}


	getPages(){
		return [
			{
				question: "What's your first name?",
				answer: "",
				type: "question",
				validate: async (answer) => {
					
					if(answer.length < 3){
						return "Your first name must be at least 3 characters!";
					}
					return true;
				}
			},

			{
				question: "What's your last name?",
				answer: "",
				type: "question",
				validate: async (answer) => {
					if(answer.length < 3){
						return "Your last name must be at least 3 characters!";
					}
					return true;
				}
			},

			{
				question: "What's your email?",
				answer: "",
				type: "question",
				validate: async (answer) => {
					if(!(this.validEmail(answer))){
						return "You must supply a valid email!";
					}
					return true;
				}
			},

			{
				question: "What's your password?",
				answer: "",
				type: "password",
				validate: async (answer) => {
					
					return true;
				}
			},

			{
				question: "Repeat your password.",
				answer: "",
				type: "password",
				validate: async (answer) => {
					if(this.pages[this.pageIndex-1].answer != answer)return "Passwords must match!";
					return true;
				}
			},

			{
				question: "What URL will your profile be located at?",
				answer: "",
				type: "question",
				validate: async (answer) => {
					let request = await this.post("slug-exists", {slug: answer});
					
					if(request.result)return "This URL is taken";
					return true;
				}
			},

		]
	}

}

new RegisterSurvey().start();