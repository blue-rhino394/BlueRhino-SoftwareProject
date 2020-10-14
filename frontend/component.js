class Component {

	render(location){
		let content = this.getContent();
		content.css(this.getStyle());
		$("#"+location).append(content);
		return content;
	}

	getContent(){}
	getStyle(){
		return {
			
		}
	}
}




class Login extends Component{

	constructor(card){
		super();
	}

	login(){
		let loginData = {email: $("#email").val(), password: $("#password").val()}
		$.post("/api/login", loginData, (response)=>{
			if(response.error==""){
				page.user = response;
				page.navigate("/");
			}
		});
	}

	signUp(){
		alert("no signup survey :'(")
	}




	getContent(){
		//create login div
		let content = $("<div/>", {"class" : "box"});

		//create login text
		content.append($("<h2/>", {text: `Login`}));

		//create email textbox
		content.append($("<input>", {
			"class": "textbox",
			type: "text",
			id: "email",
			placeholder: "email"
		}));

		content.append("<br><br>");

		//create password textbox
		content.append($("<input>", {
			"class": "textbox",
			type: "password",
			id: "password",
			placeholder: "password"
		}));

		content.append("<br><br>");

		//create login button
		content.append($("<a/>", {text:"Login", click: this.login}).css({marginLeft:"5px",marginRight:"10px"}));



		//create login button
		content.append($("<a/>", {text:"Sign Up", click: this.signUp}));

		//content.css({height: "50%"})

		return content;

	}
}



class Search extends Component{
	
	constructor(light = false){
		super();
		this.light = light;
	}

	typed(){
		let query = $(this).val();
		
		$.post("/api/search-card", {query:query, tags:[]}, (results)=>{
			
			$("#results").fadeOut(500,() => {
				$("#results").html("");

				//for loop is here to illustrate what multiple results look like 
				for(var i=0;i<query.length; i++){
					for(var result of results.cards){
						new Card(result, true).render("results");
					}
				}

				$("#results").fadeIn(500);
			});
		});
		
	}

	getContent(){


		//create card div
		let content = $("<div/>", {
			"class" : "box"
		});

		//Searh Heading
		content.append($("<h2/>", {text: `Discover Passport`}));

		//Search textbox 
		content.append($("<input>", {
			"class": "textbox",
			type: "text",
			id: "search",
			placeholder: "Enter your query",
			on: {
				input: this.typed,
			}
		}));

		//add div for swarched results
		content.append($("<div/>",{
			"id": "results",
			"css":{
				padding:"10px"
				//"backgroundColor": "#F5F5F5",
			}
		}));

		return content;
	}

}

class Card extends Component{

	constructor(card, light = false){
		super();
		this.card = card;
		this.light = light;
	}

	//shamelessly copied from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
	stringToColour(str) {
	    var hash = 0;
	    for (var i = 0; i < str.length; i++) {
	        hash = str.charCodeAt(i) + ((hash << 5) - hash);
	    }
	    var colour = '#';
	    for (var i = 0; i < 3; i++) {
	        var value = (hash >> (i * 8)) & 0xFF;
	        colour += ('00' + value.toString(16)).substr(-2);
	    }
	    return colour;
	}



	getContent(){

		//create card div
		let content = $("<div/>").css({"float":"left"});

		//determine if heading will  be h3 or h2 based on light
		let heading = (this.light) ? "h3" : "h2";

		//add first and last name to card
		content.append($(`<${heading}/>`, {
			text: `${this.card.firstName} ${this.card.lastName}`
		}))

		//add card properties
		for(const property of this.card.content.cardProperties){
			let key = property.key;
			let value = property.value;
			content.append(`${key}: ${value}<br><br>`);
		}

		//add details social and stats butts if not light, add view and save if light 
		if(!this.light){
			content.append($("<a/>", {text: "Details"}));
			content.append($("<a/>", {text: "Social"}));
			content.append($("<a/>", {text: "Stats"}));
			
		}else{
			content.append($("<a/>", {text: "View"}));
			content.append($("<a/>", {text: "Save"}));
		}
		content.append($("<br><br>"));
		
		let color = this.stringToColour(`${this.card.firstName}+${this.card.lastName}`);

		//create profile picture 
		let img = $("<img>",
		{
			src: `https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=${this.card.firstName}+${this.card.lastName}&size=300`,
			width: "50px",
			height: "50px",
			css: {float:"left", marginRight: "10px"}
		});

		//wrap content in div and put profile picture before it
		let contentList = [img, content, $("<div/>").css({"clear":"both"})]
		if(this.light)contentList.push($("<hr>"));
		content = $("<div/>").html(contentList);


		//wrap in box if it's not a light card
		if(!this.light)	content.attr("class","box");


		return content;

	}

}