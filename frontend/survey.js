

class Survey {

	constructor(){
		this.pages = this.getPages();
		this.pageIndex =0 ;
		this.currentPage = this.pages[this.pageIndex];
		this.animating = false;
		this.pageStop = 0;
	}

	start(){
		this.setContent(false);
		this.focusAll();
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

		let color = this.currentPage?.color;
		if(color==undefined) color = "#29b6f6";

		let backdrop = $("<div/>", {
			css:{
				backgroundColor: color,
				position: "absolute",
				top: 0,
				left: -window.screen.width,
				width:"100%",
				height:"100%",
				zIndex: -10
			}
		});
		$("#body").append(backdrop);

		
		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "+="+((window.screen.width)) }, 1000, "easeInCubic", () => {
			this.setContent();

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

	focusAll(){
		$("#welcomeText").focus();
		$("#questionText").focus();
		$("#passwordText").focus();
	}

	lastPage(){
		this.pageIndex -= 1;
		this.currentPage = this.pages[this.pageIndex];


		let color = this.currentPage.color;
		if(color==undefined) color = "#29b6f6";

		let backdrop = $("<div/>", {
			css:{
				backgroundColor: color,
				position: "absolute",
				top: 0,
				left: window.screen.width,
				width:"100%",
				height:"100%",
				zIndex: -10
			}
		});
		$("#body").append(backdrop);

		let content = $("#contentHolder");
		this.animating = true;
		content.animate({ "left": "-="+((content.width())) }, 1000, "easeInCubic", () => {
			this.setContent(false);

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
		let result = inputs[inputType];
		//if theres nothing in the refill for it, return nothign 
		if(result==undefined) return ()=>{};
		return result;
	}

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
						$(e.target).focus();
					},
					
				}
			}),

			option: $("<input/>", {
				type: "button",
				class: "surveyButton",
				on: {
					click: (e) => {

						//console.log("okefw");
						if(!this.animating)this.selected($(e.target).attr("value"))
					}
				}
			})

		}


		let results = [];
		if(!Array.isArray(inputTypes)) inputTypes = [inputTypes];

		for(let input of inputTypes){
			results.push(inputs[input].clone(true, true));
		}
		//console.log(results);
		return results;
		
	}

	setContent(pushState=true){
		if(this.pageIndex!=this.pages.length){
			if(pushState)window.history.pushState("", "", "");

			let inputs = this.getInput(this.currentPage.type);

			

			let elements = [
				$("<h1/>").text(this.currentPage.question),
				$("<span/>").attr("id", "error").css("color", "red").css("opacity", "0.8"),
			];

			elements = elements.concat(inputs);
		

			$("#content").html(elements);
	

			

			//this dynamically calls the items in the data array  
			if(!(this.currentPage.data==undefined)){
				let index = 2;
				for(let dataItem of this.currentPage.data){
					for(var key in dataItem){
						if (dataItem.hasOwnProperty(key)) {
							let value = dataItem[key];

							elements[index][key](value);
						}
					}
					index+=1;
				}
			}

			this.getRefill(this.currentPage.type)(this.currentPage.answer);
		}else{
			$("#content").html([
				$("<h1/>").attr("id", "finalMessage").text(this.getCompletedMessage()),
				$("<span/>").attr("id", "waitBubble").css("color","white").css("opacity", 0.5)
			]);
			this.onCompleted();
		}
	}

	getAnswer(key){
		for(let page of this.pages){
			if(page.key == key){
				return page.answer;
			}
		}
	}

	getSurveyResults(){
		let results = {};
		for(let page of this.pages){
			if(page.key != undefined && page.ignoreQuestion!=true){
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

	//captialize first letter of string
	nameify(name){
		name = name.toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

}





window.onpopstate = function () {
	if(survey.pageIndex == survey.pageStop){
		window.history.back();
		return;
	}
    survey.lastPage();
}

//lock scrollbar into place since tabindex:0 don't know how to act right
$(document).bind('scroll',function () { 
      // window.scrollTo(0,0); 
  });