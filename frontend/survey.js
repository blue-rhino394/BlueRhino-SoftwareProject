

class Survey {

	constructor(){
		this.pages = this.getPages();
		this.pageIndex = 0;
		this.currentPage = this.pages[this.pageIndex];
		this.animating = false;
		this.pageStop = 0;
	}

	start(){
		this.setContent(false);
		this.focusAll();
		$("#body").css("backgroundColor", this.currentPage.color);
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

	getCardBuilder(){

	}

	getTagQuestion(){

	}

	getSocialBuilder(){

	}

/*
	async newpost(endpoint, json){
		return new Promise(resolve => {
			let test =  {"email":"xk9wdefrvnr343nfnd@gmail.com","password":"123123","public":{"firstName":"Liverf","lastName":"Cram","customURL":"luvordie","profilePictureURL":"https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=Liverf+Cram&size=300&background=29b6f6&bold=true&color=FFFFF"}}

    		$.post(`/api/${endpoint}`, JSON.stringify(json), (data) => {resolve(data)});
  		});
	}*/


	dotify(json){
		for(const key in json){
			if(json.hasOwnProperty(key)){
				let value = json[key];
				//console.log(key);
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

	//this method returns a method that fills the answer of current question with your previously supplied answer when
	getRefill(inputType){
		/*
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
		if(result==undefined) return ()=>{};*/
		if(!inputType instanceof Array)inputType = [inputType];
		//for(let input of in)
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


			//refill answers with values


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

			//this.getRefill(this.currentPage.type)(this.currentPage.answer);
		//	this.getRefill(this.currentPage.type);
		}else{
			$("#content").html([
				$("<h1/>").attr("id", "finalMessage").text(this.getCompletedMessage()),
				$("<span/>").attr("id", "waitBubble").css("color","white").css("opacity", 0.5),

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
		return this.dotify(results);
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

		if(confirm("Are you sure you want to go back? Your progress will not be saved!")){
		//	alert(window.history.length)
		//	window.history.go(-(window.history.length))
		window.history.back();
			//return;
		}


    //survey.lastPage();
}

//lock scrollbar into place since tabindex:0 don't know how to act right
$(document).bind('scroll',function () {
      // window.scrollTo(0,0);
  });
