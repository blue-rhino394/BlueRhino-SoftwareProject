
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
				$("#finalMessage").text("Something went wrong when logging you in :'( "+loginResults.error);
			}
		}
	}

	

	getCompletedMessage(){
		return `Calm down ${this.nameify(this.pages[1].answer)}, we're making your account look pretty`;
	}



	getPages(){
		return [
			{
				question: "Welcome to Passport!",
				answer: "",
				type: "justText",
				data: [{text: "Press Enter to begin registering"}],
				validate: async (answer) => true
			},
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