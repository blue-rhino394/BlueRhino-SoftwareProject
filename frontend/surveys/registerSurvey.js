
class RegisterSurvey extends Survey{

	constructor(){
		super();

		//console.log(this.getAllFuncs());


	}

	validEmail(email) 
	{
		let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return email.match(mailformat);

	}

	getRandomArrayItem(list) {
  		return list[Math.floor((Math.random()*list.length))];
	} 


	onFinished(){
		console.log(document.cookie);
		if(this.getAnswer("businessOrPersonal")=="Personal"){
			window.location.href = "/";
		}else{
			let cardSurvey = new CardSurvey();
			this.pages = cardSurvey.getPages();

			//indescriminentaly copy all of the methods from the old survey to the current survey
			for(const func of this.getAllFuncs()){
				this[func] = cardSurvey[func];
			}


			this.pageIndex =-1;
			this.nextPage();
		}
		
	}



	//Register user !!!
	async onCompleted(){
		let surveyResults = this.getSurveyResults();
		
		let nameQuery = `${this.getAnswer("public.firstName")}+${this.getAnswer("public.lastName")}`;
		let color = this.getRandomArrayItem(["29b6f6", "9575CD", "FFAB91", "009688", "8C9EFF", "F06292"]);
		let profilePicUrl =`https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=${nameQuery}&size=300&background=${color}&bold=true&color=FFFFF`
		surveyResults.public.profilePictureURL = profilePicUrl;
	

	
		console.log("registering...");
		console.log(surveyResults);
	
		let postResults = await this.post("register", surveyResults);
		
		if(postResults.error!=""){
			$("#finalMessage").text("Something went wrong when creating your account :'(  "+postResults.error);
			console.log("An error occoured when registering: "+postResults.error);
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
					if(this.countdown==5)this.onFinished();
					$("#finalMessage").append(".");

				}, 1000);
			}else{
				$("#finalMessage").text("Something went wrong when logging you in :'( "+loginResults.error);
			}
		}
	}

	

	getCompletedMessage(){
		return `Calm down ${this.nameify(this.getAnswer("public.firstName"))}, we're making your account look pretty`;
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
				key: "public.firstName",
				color:"#9575CD",
				
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
				key: "public.lastName",
				nameify: true,
				color:"#9575CD",
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
				color: "#FFAB91",
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
				color:"#009688",
				validate: async (answer) => {
					if(answer.length < 5)return "Your password must be at least 5 characters!";
					
					return true;
				}
			},

			{
				question: "Ok, but do you remember it?",
				answer: "",
				type: "password",
				color:"#009688",
				validate: async (answer) => {
					if(this.getAnswer("password") != answer)return "Passwords must match!";
					return true;
				}
			},

			{
				question: "What URL will your profile be located at?",
				answer: "",
				type: "question",
				key: "public.customURL",
				color: "#8C9EFF",
				validate: async (answer) => {
					if(answer.length<4)return "This URL is too short!"
					let request = await this.post("slug-exists", {slug: answer});
					if(request.result)return "This URL is taken!";
					return true;
				}
			},
			{
				question: "Is this account for business or personal use?",
				answer: "",
				color: "#F06292",
				key: "businessOrPersonal",
				ignoreQuestion: true,
				type: ["option", "option"],
				data: [{attr: {"value": "Business"}}, {attr: {"value":"Personal"}}],
				validate: async (answer) => true
			},

		]
	}

}