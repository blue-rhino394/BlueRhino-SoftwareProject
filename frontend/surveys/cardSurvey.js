

class CardSurvey extends Survey{

	constructor(){
		super();
	//	this.getLoginInfo();
		//page.user = 
	}

	async getLoginInfo(){
		this.animating = true;
		this.user = await this.post("login", {});
		//console.log(page.user);
		this.animating = false;
	}

	async onCompleted(){
	}

	getQuestionData(){
		return {
			css: {
				width:"30%", 
				float: "left",
				minWidth:"10%"
			},

		}
			
	}

	getCardContent(){
		return {
			cardID: "xxx",
			ownerID: "xxx",
			ownerInfo: {
				firstName: "Marc",
				lastName: "Fervil",
				customURL: "doqkw",
				profilePictureURL: ""
			},
			content: [
				{key: "loves", value: "swimming"}
			]
		}
	}

	bigText(text, index){
		return ( index==0 ) ? $("<h2/>").css({"float":"left","padding":"0px", "margin":"0px"}).text(text) : $("<h2/>").css({"float":"left", "margin":"0px", "padding":"0px", "fontWeight": "normal", "opacity":0.7}).text(text);
	}

	getTextBox(index){
		return $("<input/>", {
				"class": "surveryQuestion", 
				type: "text",
				id: "questionText",
				placeholder: (index==0) ? "Qualification" : "Value",
				
				on: {
					keypress: (e) => {
						//alert(e.which);
						if(e.which === 13 && !this.animating) {
							//alert(index);
							
							let typed = $(e.target).val();
							if(index == 1){
								$("#cardBuilder").append(this.getQualificationPair());
								this.currentAnswer.value = typed;
								this.currentPage.answer.push(this.currentAnswer);
							}else{
								this.currentAnswer={key: typed, value:""};
							}
							$(e.target).next().next().focus()
							
							$(e.target).replaceWith(this.bigText(typed, index));
						}
					},
					keydown: (e) => {
						
						if(e.which== 9&& !this.animating){
							e.preventDefault();
							let typed = $(e.target).val();
							if(index == 1){
								$("#cardBuilder").append(this.getQualificationPair());
								this.currentAnswer.value = typed;
								this.currentPage.answer.push(this.currentAnswer);
							}else{
								this.currentAnswer={key: typed, value:""};
							}
							$(e.target).next().next().focus()
							
							$(e.target).replaceWith(this.bigText(typed, index));
						}
					}
				},
				css: {
					float: "left",
					minWidth :"30%",
					width: "30%"
				}
			})
	}


	getTag(text){
		return $("<span/>").attr("class", "tag").css({
			//"float":"left", 
			margin:"5px",
			marginRight:"5px", 
			"display":"flex",
			"alignItems": "center",
			padding:"5px",
			whiteSpace: "nowrap"
			
		}).text(text);
	}

	getTagQuestion(){
		//theres some real fuckery going on here
		return  $("<div/>", {
				"class": "surveryQuestion", 
				css:{"margin":"10px"},
				id: "questionText",
				//¿¿¿ no, like, why the FUCK does this have to use a CSS grid ???
				css: {display: "flex"},
				html: $("<input/>",{
					type: "text",
					placeholder: "Type your tags seperated by a comma and press enter",
					"class": "surveryQuestionGhost",
					on: {
						keypress: (e) => {
							//alert(e.which);
							
							let answer = $(e.target).val().trim();
							//console.log($(e.target).width());
							if($(e.target).width() < 100){
								
								alert("You've reached the tag limit!")
								$(e.target).val("");
								e.preventDefault();
								return;
							}
							if(e.which===44 ){
								

								if(answer!=""){
									$(e.target).before(this.getTag(answer));
									$(e.target).val("");
									//if(this.currentPage.answer.length)
									$(e.target).attr("placeholder","");
									e.preventDefault();
									this.currentPage.answer.push(answer);
								}else{
									$(e.target).val("");
									e.preventDefault();
								}
							}
							if(e.which === 13 && !this.animating) this.selected(this.currentPage.answer);
						},
						//backspace only works on keydown
						keydown: (e) => {
							let me = $(e.target);
							if(e.which==8 && me.val()==""){
								me.prev().remove();
								this.currentPage.answer.pop();
								if(this.currentPage.answer.length==0)me.attr("placeholder", "Indecisive, are we?");
							}
							
						}
					}
				})
				
			})
	}


	getQualificationPair(){
		return [

				this.getTextBox(0),
				$("<div/>").text(":").css({"float": "left", "fontSize": "1.17em", "marginLeft":"5px", "marginRight":"10px"}),
				this.getTextBox(1),
				//"<br>","<br>",
				$("<br>").css("clear", "both")
			]
	}

	getSocialPair(){
		return [

			$("<input/>", {
				"class": "surveryQuestion", 
				type: "text",
				id: "questionText",
				placeholder: "type a social media link and press enter",
			
				css: {
					float: "left",
					
					width: "100%"
				}
			}),
				
			$("<br>").css("clear", "both"),
			]
	}

	getSocial(){
		return [$("<input/>", {
				"class": "surveryQuestion", 
				type: "text",
				id: "questionText",
				placeholder: "Enter a social media link",
				
				on: {
					keypress: (e) => {
						if(e.which === 13 && !this.animating) {
							//alert(index);
							
							let typed = $(e.target).val();
						
							$("#socialBuilder").append(this.getSocial());

							this.currentPage.answer.push(typed);
						
							$(e.target).next().next().focus()
							
							$(e.target).replaceWith([this.bigText(typed, 0),"<br>"]);
						}
					},

				},
				css: {
					float: "left",
					minWidth :"30%",
					
				}
			}),$("<br>").css("clear", "both")]
	}

	//build card builder
	getCardBuilder(){
		return $("<div/>", {
			
			html: [
				$("<div/>", {
					id : "cardBuilder",
					html : this.getQualificationPair()
				}),
				$("<input/>", {
					type:"button", 
					id:"finished", 
					click: (e) => {
						console.log(this.currentPage.answer);
						this.nextPage()
					}
				}).attr("class", "surveyButton").val("Finished").css("marginTop","20px"),

			]

			
		}).css("position", "fixed")
	}

	getSocialBuilder(){
		return $("<div/>", {
			
			html: [
				$("<div/>", {
					id : "socialBuilder",
					html : this.getSocial()
				}),
				$("<input/>", {
					type:"button", 
					id:"finished", 
					click: (e) => {
						console.log(this.currentPage.answer);
						this.nextPage()
					}
				}).attr("class", "surveyButton").val("Finished").css("marginTop","20px"),

			]

			
		}).css("position", "fixed")
	}


	getCompletedMessage(){
		return `Please wait while we force Graham to write down your personal info`;
	}

	onFinished(){
		window.location.href = "/";
	}

	async onCompleted(){
		
		let surveyResults = this.getSurveyResults();
		surveyResults.published = false;
		surveyResults.layout = {"background": "#FFFFFF", "fontColor": "#00000"}
		//console.log(surveyResults);
		let postResults = await this.post("set-card", surveyResults);
		if(postResults.error==""){
			this.countdown=0;
			window.setInterval(() => {
				this.countdown+=1;
				if(this.countdown==5)this.onFinished();
				$("#finalMessage").append(".");
				
			}, 1000);
		}else{
			$("#finalMessage").text("Something went wrong when creating your card :'(  "+postResults.error);
		}
	}



	getPages(){
		return [

		
			{
				
				question: "Time to build your Passport!",
				color: "#7E57C2",
				answer: "",
				type: "justText",
				data: [{text: "Press Enter to begin building your Passport"}],
				validate: async (answer) => true
			
			},

			{
				
				question: "Enter your qualifications",
				color: "#7E57C2",
				answer: [],
				type: "cardBuilder",
				data: [],
				key: "cardProperties",
				validate: async (answer) => true
			
			},


			{
				
				question: "Enter your tags",
				color: "#7E57C2",
				answer: [],
				type: "tagQuestion",
				key: "tags",
				validate: async (answer) => true
			
			},


			{
				
				question: "Add you social media accounts",
				color: "#7E57C2",
				answer: [],
				type: "socialBuilder",
				key: "socialMediaLinks",
				validate: async (answer) => true
			
			},



		]
	}

}

//I just don't know anymore man
