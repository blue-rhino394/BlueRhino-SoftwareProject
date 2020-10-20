class Component {

	render(locationId){
		let content =  undefined;
		
		try{

				
			let location = $("#"+locationId);
			content = this.getContent();
			content.css(this.getStyle());
			
			
			this.element = content.appendTo(location);
			this.onRender();
		}catch(err){
			console.error(err);
			new ErrorComponent(err).render(locationId);
		}
	
		return content;
	}

	deRender(){
		this.element.remove();
	}

	getContent(){}
	onRender(){}
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
				console.log(page.user);
				page.navigate("/");
			}
		});
	}

	signUp(){
		window.location.href = "registersurvey.html";
	}


	getContent(){
		//create login div
		let content = $("<div/>", {"class" : "box"});
		//console.log(wfew);
		//create login text
		content.append($("<h2/>", {text: `Login`}));
		//console.log(lalala);
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

//if the error component has an error, the website will crash- no one fuck with the error component
class ErrorComponent extends Component{

	constructor(error){
		super();
		this.error = error;
	}

	getContent(){
		let content = $("<div/>").attr("class", "box");
		content.append($("<h1/>").html("<span style='color: #29b6f6'>Oopsie</span> Woopsie Uwu we made a fucky wucky!!!"));
		content.append($("<h2/>").text(this.error));
		return content;
	}

}

class CardViewer extends Component{
	
	constructor(slug){
		super();
		this.slug = slug;
	}

	onRender(){
		this.view(this.slug);
	}

	getContent(){
		let content = $("<div/>");
		let heading = "Your Card";
		content.append($("<h1/>").html("Your Card").attr("id", "cardHeading"));
		content.append($("<div/>").attr("id", "cardDisplay"));
		return content;
	}

	async getCardData(cardUrl){
		return new Promise(resolve => {
    		$.post(`/api/get-card`, {"slug": cardUrl}, (data) => resolve(data.card));
  		});
	}

	async view(slug){
		let display = $("#cardDisplay");
		let cardData = await this.getCardData(slug);
		//display.empty();
		if(display.length > 0){
			display.fadeOut(500, ()=>{
				display.empty();
				this.showCard(cardData);
				display.fadeIn(500);
			});
		}else{
			display.hide();
			showCard(cardData);
			display.fadeIn(500);
		}

	}

	showCard(cardData){
		let card = new Card(cardData)
		card.render("cardDisplay");

		let headingText = `${cardData.firstName}'s Card`
		if(card.myCard)headingText = "Your Card";
		$("#cardHeading").html(headingText);

		if(card.myCard){
			card.toggleAction("Social", true);
			card.toggleAction("Stats", true);
			card.toggleAction("Details", true);
		}
	}

}

class Search extends Component{
	
	constructor(searchText, type = "none"){
		super();
		this.searchText = searchText;
		this.light = (type=="light");
		this.favorite = (type=="favorite");

	}

	onRender(){
		if(this.favorite)this.showResults("", 6);
	}

	typed(){

		let query = $("#search").val();
		this.showResults(query.length)
		
	}

	showResults(query, dupe = -1){
		if(dupe==-1)dupe = query.length;
		$.post("/api/search-card", {query: query, tags:[]}, (results) => {
			
			$("#results").fadeOut(500,() => {
				$("#results").html("");

				//for loop is here to illustrate what multiple results look like 
				for(var i=0; i < 5; i++){
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
		if(!this.favorite)content.append($("<h2/>", {text: this.searchText}));

		//Search textbox 
		content.append($("<input>", {
			"class": "textbox",
			type: "text",
			id: "search",
			placeholder: "Enter your query, human",
			css: {width: "100%"},
			on: {
				input: ()=>this.typed(),
			}
		}));

		//add div for swarched results
		content.append($("<div/>",{
			"id": "results",
			"css":{
				padding:"10px"
			}
		}));

		return content;
	}

}


class CardStats extends Component{

	constructor(stats){
		super();
		this.stats = stats;
	}

	getContent(){
		//create card
		let content = $("<div/>",{
			"id": "Stats",
			"class": "box"
		});

		//add heading
		content.append($("<h1/>").html(`<span style='color: #29b6f6'>${page.user.firstName}'s</span> Stats`));

		//add stats 
		for(var key in this.stats){
			if (this.stats.hasOwnProperty(key)) {
				let value = this.stats[key];
				if(key!="social"){
					content.append(`<hr>${key}: <b>${value.length}</b><br>`);
				}
			}
		}

		//wrap content in div to ensure there is a linebreak when details/social/stats are swapped in and out 
		content = $("<div/>").html([content, "<br>"]);
		return content;
	}

}

class CardDetails extends Component{

	constructor(tags){
		super();
		this.tags = tags;
	}

	getContent(){
		//create card
		let content = $("<div/>",{
			"id": "Details",
			"class": "box",
			"css": {"textAlign": "center"}
		});

		//add heading
		content.append('<b>Tags: </b>');

		//add tags 
		console.log(this.tags);
		for(var tag of this.tags){
			content.append($("<input/>", {"class": "tag", type:"button", value: tag}))
		}

		//wrap content in div to ensure there is a linebreak when details/social/stats are swapped in and out 
		content = $("<div/>").html([content, "<br>"]);
		return content;
	}

}

class CardSocial extends Component{

	constructor(firstName, links){
		super();
		this.firstName = firstName;
		this.links = links;
	}

	getContent(){
		//create card
		let content = $("<div/>", {
			"id": "Social",
			"class": "box"
		});

		//add heading
		content.append($("<h1/>").html(`<span style='color: #29b6f6'>${this.firstName}'s</span> Social`));

		//add stats 
		for(var link of this.links){
			content.append(["<hr>", $("<a/>", {text: link, href: link, target: "_blank"}), "<br>"]);
		}

		//wrap content in div to ensure there is a linebreak when details/social/stats are swapped in and out 
		content = $("<div/>").html([content, "<br>"]);
		return content;
	}

}


class Card extends Component{

	constructor(card, light = false){
		super();
		this.card = card;
		this.light = light;

		this.myCard = this.card.ownerID == page.user.uuid;

		console.log(this.card);
		this.actions = {
			"Details": new CardDetails(this.card.content.tags),
			"Social": new CardSocial(this.card.firstName, this.card.content.socialMediaLinks),
			"Stats": new CardStats(this.card.stats),
			"View": ()=>{this.viewCard()}
		} 
		
	}

	
	getButtons(){
		//details : Tags
		//Social : social media links
		//Stats: card stats
		return (!this.light) ? ["Details", "Social", "Stats"] : ["View", "Save"]
	}

	viewCard(){
		//page.getCardViewer().view(this.card);
		this.card.customURL="gfreezy";
		page.navigate("/"+this.card.customURL);
	}

	toggleAction(actionName, forceRender=false){
		let action = this.actions[actionName];
		if(action instanceof Component){
			if(!($("#"+actionName).length) || forceRender){
				action.render("actions");
			}else{
				action.deRender();
			}
		}else{
			action();
		}
	}

	getContent(){
		//create content div
		let content = $("<div/>").attr("class", "card");
		let heading = (this.light) ? "h3" : "h2";

		//add profile pic to card
		let color = "29b6f6";
		let nameQuery = `${this.card.firstName}+${this.card.lastName}`;
		let prfoilePicUrl =`https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=${nameQuery}&size=300&background=${color}&bold=true&color=FFFFF`;
		content.append($("<div>", {
			"class": "profilePic",
			html: $("<img/>").attr("src", prfoilePicUrl)
		}));

		//add first and last name heading to card
		content.append($("<div/>", {
			"class": "name",
			html: $(`<${heading}/>`).text(`${this.card.firstName} ${this.card.lastName}`)	
		}));

		//add card properties
		let props = $("<div/>").attr("class", "properties");
		for(const property of this.card.content.cardProperties){
			let key = property.key;
			let value = property.value;
			props.append(`${key}: ${value}<br>`);
		}
		content.append(props)

		//add card buttons
		let buttons = $("<div/>").attr("class", "buttons");
		for(const button of this.getButtons()){
			buttons.append($("<a/>", {text: button, click:()=>this.toggleAction(button)}));
		}

		content.append(buttons)

		//if this is a full/non-light card, wrap it in a div, and add another div to hold the card actions (details, social, etc)
		if(!this.light)	{
			let oldContent = content.attr("class", "box card");
			//TODO: add divs so order stays the same 
			content = $("<div/>").html([oldContent]);
			content.append($("<br>"));
			content.append($("<div/>").attr("id", "actions"));
		}
		return content;
	}


}