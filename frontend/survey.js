



class Survey {

	constructor(){
		this.pages = this.getPages();
		this.pageIndex = this.pages.length-1;
		this.currentPage = this.pages[this.pageIndex];
		this.animating = false;
	}

	start(){
		this.setContent(false);
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

	lastPage(){
		this.pageIndex -= 1;
		this.currentPage = this.pages[this.pageIndex];
		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "-="+((content.width())) }, 1000, "easeInCubic", () => {
			this.setContent(false);

			content.css("left", `${content.width()*2}px`);
			content.animate({ "left": "0px" }, 1000, "easeOutCubic", () => {
				this.animating = false;
			});
		});
	}

	//this method returns a method that fills the answer of current question with your previously supplied answer when 
	getRefill(inputType){
		let inputs = {
			question : (answer) => {
				$("#questionText").val(answer);
			},
			password : (answer) => {
				$("#passwordText").val(answer);
			},
		} 
		return inputs[inputType];
	}

	getInput(inputType){
		let inputs = {

			question: $("<input/>", {
				"class": "surveryQuestion", 
				type: "text",
				id: "questionText",
				placeholder: "Type your answer and press enter",
				on: {
					keypress: (e) => {
						if(e.which === 13 && !this.animating) this.selected($(e.target).val());
					}
				}
			}).attr("autocomplete", "off"),


			password: $("<input/>", {
				"class": "surveryQuestion", 
				type: "password",
				id: "passwordText",
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

	setContent(pushState=true){
		if(this.pageIndex!=this.pages.length){
			if(pushState)window.history.pushState("", "", "");
			let input = this.getInput(this.currentPage.type);
			$("#content").html([
				$("<h1/>").text(this.currentPage.question),
				$("<span/>").attr("id", "error").css("color", "red").css("opacity", "0.8"),
				input
			]);
			input.focus();
			this.getRefill(this.currentPage.type)(this.currentPage.answer);
		}else{
			$("#content").html([
				$("<h1/>").attr("id", "finalMessage").text(this.getCompletedMessage()),
				$("<span/>").attr("id", "waitBubble").css("color","white").css("opacity", 0.5)
			]);
			this.onCompleted();
		}
	}

	getSurveyResults(){
		let results = {};
		for(let page of this.pages){
			if(page.key != undefined){
				let answer = page.answer;
				if(page.nameify) answer = this.nameify(answer);
				results[page.key] = answer;
			}
		}
		return results;
	}

	getPages(){
		
	}

	completedMessage(){

	}

	onCompleted(){

	}

	nameify(name){
		name = name.toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
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

	//Register user !!!
	async onCompleted(){
		let surveyResults = this.getSurveyResults();
		surveyResults["profilePictureURL"] = "#29b6f6"
		console.log("registering...");
		let postResults = await this.post("register", surveyResults);
		
		if(postResults.error!=""){
			$("#finalMessage").text("Something went wrong when creating your account :'( "+postResults.error);
			console.log("An error occoured when registering "+postResults.error);
		}else{
			console.log("registered!");
			let loginData = {email: surveyResults.email, password: surveyResults.password};
			console.log("logging in...")
			console.log(loginData);
			let loginResults = await this.post("login", loginData);
			if(loginResults.error==""){
				console.log("logged in! Redirecting...");
				this.countdown = 0;
				window.setInterval(() => {
					this.countdown+=1;
					if(this.countdown==5)window.location.href = "/";
					$("#finalMessage").append(".");

				}, 1000);
			}else{
				$("#finalMessage").text("Something went wrong when loggin you in :'( "+loginResults.error);
			}
		}
	}

	

	getCompletedMessage(){
		return `Calm down ${this.nameify(this.pages[0].answer)}, we're making your account look pretty`;
	}



	/*

		Interface userAccountSchema
		email: string
		passwordHash: string
		firstName: string
		lastName: string
		customURL: string
		profilePictureURL: string	
	*/

	getPages(){
		return [
			{
				question: "What's your first name?",
				answer: "",
				type: "question",
				nameify: true,
				key: "firstName",
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
				key: "lastName",
				nameify: true,
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
				key: "email",
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
				key: "password",
				validate: async (answer) => {
					if(answer.length < 5)return "Your password must be at least 3 characters!";
					
					return true;
				}
			},

			{
				question: "Ok, but do you remember it?",
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
				key: "customURL",
				validate: async (answer) => {
					if(answer.length<4)return "This URL is too short!"
					let request = await this.post("slug-exists", {slug: answer});
					if(request.result)return "This URL is taken!";
					return true;
				}
			},

		]
	}

}

var survey = new RegisterSurvey()
survey.start();


window.onpopstate = function () {
	if(survey.pageIndex == 0){
		window.history.back();
		return;
	}
    survey.lastPage();
}