
//this class is is the base survey class that is extended for both types of surverys (registration / card creation)
//they are supposed to provide a fluid and intutive user experience for filling out information
//the code turned into spaghetti in the last few weeks because it did not support certain functionalites/inputs

class Survey {

	//initialize all the class's variables
	constructor(){
		this.pages = this.getPages();
		this.pageIndex = 0;
		this.currentPage = this.pages[this.pageIndex];
		this.animating = false;
		this.pageStop = 0;
	}

	//start the survey
	start(){
		this.setContent(false);
		this.focusAll();
		$("#body").css("backgroundColor", this.currentPage.color);
	}

	//this function is called whenever the user is finished filling out a page
	//the function calls the current page's validation method, if it doesn't return "true", it does not take you to the next page and displays an error
	//if the validation goes thru it takes you to the next page
	async selected(result){
		let valid = await this.currentPage.validate(result);
		if(valid==true){
			this.currentPage["answer"] = result;
			this.nextPage();
		}else{
			$("#error").text(valid);
		}
	}

	//returns a list of all the functions in a class
	//I use this so that I can ultimately merge the registration and the card creation surveys together
	getAllFuncs() {
		let obj = this;
		let methods = new Set();
		while (obj = Reflect.getPrototypeOf(obj)) {
			let keys = Reflect.ownKeys(obj)
			keys.forEach((k) => methods.add(k));
		}
		return methods;
	}



	//makes jquery post requests awaitable
	async post(endpoint, json){
		return new Promise(resolve => {
			//this is dumb
    		$.ajax({
			  	url: `/api/${endpoint}`,
			  	type: "POST",
			  	data: JSON.stringify(json),
			  	dataType: "json",
			  	contentType: "application/json; charset=utf-8",
			  	success: (data) => {resolve(data)}

			});

  		});
	}

	/*These three methods are overriden for a survey that uses the cardbuilder, tagquestion, or social builder input, so I don't further clutter the getInput function*/
	getCardBuilder(){

	}

	getTagQuestion(){

	}

	getSocialBuilder(){

	}

	//this is a util method that when supplied with a json that has a key like this "key.value":actual it turns the key/value into key:{value:realvalue }
	//this method is used for the registration survey to help me format the answers from the getAnswers() function to fit Graham's backend schemas
	dotify(json){
		for(const key in json){
			if(json.hasOwnProperty(key)){
				let value = json[key];
				if(key.includes(".")){
					let dictName = key.split(".")[0];
					let dictKey = key.split(".")[1];
					if(json[dictName]==undefined)json[dictName] = {};
					json[dictName][dictKey] = value;
					delete json[key];
				}
			}
		}
		return json;
	}

	//this goes to the next page of the survery
	//it first moves the content element out of view w an animation, then it moves the content element to the left the of the screen so the user can't see it
	//then it changes the content by calling setContent() then slides it back into view with the updated content & backgrond color
	nextPage(){
		this.pageIndex += 1;
		this.currentPage = this.pages[this.pageIndex];

		let color = this.currentPage?.color;
		if(color==undefined) color = "#29b6f6";

		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "+="+((window.screen.width)) }, 1000, "easeInCubic", () => {
			this.setContent();

			let backdrop = $("<div/>", {
				css:{
					backgroundColor: color,
					position: "absolute",
					top: 0,
					left: `-${content.width()*2}px`,
					width:"100%",
					height:"100%",
					zIndex: -10
				}
			});
			$("#body").append(backdrop);


			content.css("left", `-${content.width()*2}px`);
			backdrop.animate({ "left": "0px" }, 1000, "easeOutCubic");
			content.animate({ "left": "0px" }, 1000, "easeOutCubic", () => {
				$("#body").css("backgroundColor", color);
				backdrop.remove();
				this.animating = false;
				this.focusAll();
			});
		});

	}

	//focuses the specifc inputs that require focus
	focusAll(){
		$("#welcomeText").focus();
		$("#questionText").focus();
		$("#passwordText").focus();
	}

	//same thing is the nextpage, just backwards
	lastPage(){
		this.pageIndex -= 1;
		this.currentPage = this.pages[this.pageIndex];


		let color = this.currentPage.color;
		if(color==undefined) color = "#29b6f6";



		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "-="+((content.width())) }, 1000, "easeInCubic", () => {
			this.setContent(false);

			let backdrop = $("<div/>", {
				css:{
					backgroundColor: color,
					position: "absolute",
					top: 0,
					left: `${content.width()*2}px`,
					width:"100%",
					height:"100%",
					zIndex: -10
				}
			});
			$("#body").append(backdrop);

			content.css("left", `${content.width()*2}px`);
			backdrop.animate({ "left": "0px" }, 1000, "easeOutCubic");
			content.animate({ "left": "0px" }, 1000, "easeOutCubic", () => {
				$("#body").css("backgroundColor", color);
				backdrop.remove();
				this.animating = false;
				this.focusAll();
			});
		});
	}

	//this method returns a method that fills the answer of current question with your previously supplied answer when you press the back arrow
	getRefill(inputType){

		if(!inputType instanceof Array)inputType = [inputType];

		return result;
	}

	//given a list of inputs or a single input, it returns a list JQuery/ HTML elements that should be on the page
	//In hindsight, this method is far too long and the inputs should've been split up for clarity
	getInput(inputTypes){
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
				},

				data:{
					refill:(me, answer) =>{
						me.val(answer);
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
				},

				data:{
					refill:(me, answer) =>{
						me.val(answer);
					}
				}
			}),

			justText: $("<div/>", {
				id: "welcomeText",
				css:{
   					opacity: 0.7,
   					outline: "none"
				},
				tabindex:0,
				on: {
					keypress: (e) => {
						if(e.which === 13 && !this.animating){
							this.selected();
							//$(e.target).unfocus()
						}
					},
					//prevent div from ever losing focus so enter can always be pressed
					focusout:(e) => {
						console.log("fijewfjiwe");
						setTimeout(()=>{
							$(e.target).focus();
						},15)

					},

				},
				data:{
					refill:(me, answer) =>{

					}
				}
			}),

			text: $("<div/>", {
				id: "welcomeText",



				data:{
					refill:(me, answer) =>{
						me.val(answer);
					}
				}
			}),

			option: $("<input/>", {
				type: "button",
				class: "surveyButton",
				on: {
					click: (e) => {

						//console.log("okefw");
						if(!this.animating)this.selected($(e.target).attr("value"))
					},
				},

				data:{
					refill:(me, answer) =>{
						if(answer==me.val()){
							me.addClass("surveyButtonHover");
						}
					}
				}
			}),

		//	card: new Card(this.getCardContent()).getContent()
			cardBuilder: this.getCardBuilder(),
			tagQuestion: this.getTagQuestion(),
			socialBuilder: this.getSocialBuilder()
		}


		let results = [];
		if(!Array.isArray(inputTypes)) inputTypes = [inputTypes];

		for(let input of inputTypes){
			results.push(inputs[input].clone(true, true));
		}
		//console.log(results);
		return results;

	}


	//this method sets the content thats going to be on the current survey page
	//it does this by getting the current page's JSON type list/string and rendering the corrosponding inputs
	setContent(pushState=true){
		if(this.pageIndex!=this.pages.length){
		//	if(pushState)window.history.pushState("", "", "");

			let inputs = this.getInput(this.currentPage.type);


			let elements = [
				$("<h1/>").html([
					this.currentPage.question,
					$("<div/>").attr("class", "surveyError").attr("id", "error")
				]),

				//$("<span/>").attr("id", "error").css("color", "red").css("opacity", "1"),
			];
			if(this.pageIndex>0){
				elements.push($("<i/>", {"class":"fas fa-arrow-left backButton"}).click(()=>{if(!this.animating)this.lastPage()}));
			}

			elements = elements.concat(inputs);



			$("#content").html(elements);


			//this dynamically calls the items in the data array
			if(!(this.currentPage.data==undefined)){
				let index = (this.pageIndex==0)? 1 : 2;
				for(let dataItem of this.currentPage.data){
					for(var key in dataItem){
						if (dataItem.hasOwnProperty(key)) {
							let value = dataItem[key];
							if(key=="start"){
								value()
								continue;
							}
							elements[index][key](value);
						}
					}
					index+=1;
				}
			}

			for(const input of inputs){
				input.data("refill")(input, this.currentPage.answer);
			}

		}else{
			$("#content").html([
				$("<h1/>").attr("id", "finalMessage").text(this.getCompletedMessage()),
				$("<span/>").attr("id", "waitBubble").css("color","white").css("opacity", 0.5),

			]);
			this.onCompleted();
		}
	}

	//this returns the answer of a page given the question
	getAnswer(key){
		for(let page of this.pages){
			if(page.key == key){
				return page.answer;
			}
		}
	}

	//this method returns an aggreate of all of the answers you provided from the survey
	//the answer is stored in the answer portion of the JSON
	getSurveyResults(){
		let results = {};
		for(let page of this.pages){
			if(page.key != undefined && page.ignoreQuestion!=true){
				let answer = page.answer;
				if(page.nameify) answer = this.nameify(answer);
				results[page.key] = answer;
			}
		}
		return this.dotify(results);
	}

	/*
		This function returns a list of JSON objects that corrospond to each page of the survey.
		It should be overriden by each child survey

		This is an example of a survey page asking for the user's first name:

		{
			//this is the question that is asked on the page
			question: "What's your first name?",

			//this is where this page's answer is stored.  It is usually an empty string or an empty array.
			answer: "",

			//this can either be a single input or an arrray of inputs that are rendered on to the page
			type: "question",

			//if this is set to true, it captializes the first letter of the answer EX: marc -> Marc
			nameify: true,

			//the key in the answer JSON that the answer corrosponds to
			key: "public.firstName",

			//the background color that the page should be
			color: "#7E57C2",

			//this function returns a string that corrosponds to the reason they they could not advance to the next page,
			//otherwise returns true if they can advance
			validate: async (answer) => {
				if(answer.includes(" "))return "Your first name cannot contain spaces!"
				if(this.hasSpecialChars(answer)) return "Your first name cannot contain any special characters!";
				if(answer.length < 2){
					return "Your first name must be at least 2 characters!";
				}
				return true;
			}
		},

	*/
	getPages(){

	}

	//this is intended to be overriden by child Surveys.
	//it retruns a string that corrosponds to the message that is displayed when the survey is completed
	//and we are waiting for the answers to be aggrigated and sent to the server
	//ex: `Calm down <username>, we're making your account look pretty`;
	completedMessage(){

	}

	//this is what's called when the survey is completed
	//this is where we aggreate the results of the survey and send it to server, depending on the results,
	//we navigate to either the next survey, the home page of the website, or display an error message that details what went wrong when processing this survey
	onCompleted(){

	}

	//captialize first letter of string
	nameify(name){
		name = name.toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

}




//function is called whenever you navigate back on a survey to warn the user that there progress will not be saved
window.onpopstate = function () {

	if(confirm("Are you sure you want to go back? Your progress will not be saved!")){

		window.history.back();

	}

}
