

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
							//$(e.target).next("#questionText").focus();
						}
						//this.selected($(e.target).val());
					}
				},
				css: {
					float: "left",
					minWidth :"30%",
					width: "30%"
				}
			}).attr("autocomplete", "off")
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
				validate: async (answer) => true
			
			},


			{
				
				question: "Enter your tags",
				color: "#7E57C2",
				answer: "",
				type: "question",
				data: [{attr:{"placeholder": "press space after each tag"}}],
				validate: async (answer) => true
			
			},



		]
	}

}