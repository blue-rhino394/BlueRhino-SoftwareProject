
//the Component class
//the metaphorical glue that holds our colective GPA together
class Component {

	//this function sends a post request to an api endpoint and calls a callback
	post(endpoint, json={}, callback){
        $.ajax({
              url: `/api/${endpoint}`,
              type: "POST",
              data: JSON.stringify(json),
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              success: (data) => {callback(data)}

        });
    }

	 //does the same thing as the above function accept it's awaitable
    async awaitPost(endpoint, json={}){
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

	//this function's purpose is to render any component on the page given a locationId (ID of element where you want it to be rendered)
	//the fadeIn parameter makes the compnent fade in when it's created
	//also adds component to page's list of components
	render(locationId, fadeIn=false){
		let content =  undefined;

		try{
			let location = $("#"+locationId);
			this.location = locationId;
			page.components.push(this);
			if(!fadeIn){

				content = this.getContent();
				if(!content instanceof Array)content.css(this.getStyle());

				if(!this.replaceContainer()){
					this.element = content.appendTo(location);

				}else{
					this.element = location.html(content);
				}
				this.onRender();
			}else{

				location.hide();
				this.render(locationId);
				location.fadeIn(500);
			}
		}catch(err){
			//render error component if something goes wrong
			console.error(err);
			new ErrorComponent(err).render(locationId);
		}

		return content;
	}

	//this function is overridden with "true" if you dont want to append the component to the element and instead replace the contents of said container
	replaceContainer(){
		return false;
	}

	//this function removes a component from the page, animate makes it fade out when its removed
	//also removes component from page's list of components
	async deRender(animate=false){
		page.components.splice(page.components.indexOf(this), 1);
		if(!animate){
			this.element.remove();
		}else{
			return new Promise(resolve => {
	            this.element.fadeOut(500, ()=> {
					resolve()
				});

        	});

		}
	}
	//this function is overridden by other child components
	//it returns the JQuery / HTML element that is to be displayed on the page
	getContent(){}

	//this function is overridden by other child components
	//it is called after the child component is rendered
	onRender(){}

	//this function returns a JSON of the css styles that should be applied to the component
	getStyle(){
		return {

		}
	}
}



//this component allows the user to log in
class Login extends Component{

	constructor(card){
		super();
	}

	loginWrapper(){
		this.login();
	}

	onRender(){
		$("#SavedText").text("Sign in to Save Cards");
	}

	//this function logs the user in
	async login(){

		let loginData = {email: $("#email").val(), password: $("#password").val()}
		let response = await this.awaitPost("login", loginData);
		console.log(response);

		if(response.error==""){

			page.user = response;


			if(page.getUrl()!="/"){
				let x = await this.deRender(true);

				$("#SavedText").text("Saved Cards");
				new Search("Saved Cards", "myCards").render(this.location, true);
			}else{
				page.navigate("/");
			}

		}else{
			alert(response.error);
		}

	}

	//this function takes the user to the Registration page if they click register
	signUp(){
		window.location.href = "/register";
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
		//content.append($("<a/>", {text:"Login", click: ()=>{this.loginWrapper()}}).css({marginLeft:"5px", marginRight:"10px"}));
		content.append($("<a/>", {text:"Login", click: ()=>{this.login()}}).css({marginLeft:"5px", marginRight:"10px"}));

		//create login button
		content.append($("<a/>", {text:"Sign Up", click: this.signUp}));

		//content.css({height: "50%"})

		return content;

	}
}

//the component that renders in the event of some unforseable error
//if the error component has an error, the website will crash- no one touch with the error component
class ErrorComponent extends Component{

	constructor(error){
		super();
		this.error = error;
	}

	getContent(){
		//create div
		let content = $("<div/>").attr("class", "box");

		//add objectively funny error message to said div
		content.append($("<h1/>").html("<span style='color: #29b6f6'>Oopsie</span> Woopsie Uwu we made a V_V !!!"));
		content.append($("<h2/>").text(this.error));
		return content;
	}

}

//this component's purpose is to render a message anywhere I need to for whatever reason
class MessageComponent extends Component{

	constructor(title, message=""){
		super();
		this.title = title;
		this.message = message;
	}

	getContent(){
		//create div
		let content = $("<div/>").attr("class", "box");

		//add title
		content.append($("<h2/>").html(this.title).css("margin", "0px").css("marginBottom", "10px"));
		let span = $("<span/>");
		if(this.message instanceof Array){
			for(let msg of this.message){
				span.append(msg);
			}
		}else{
			span.html(this.message);

		}

		content.append(span);
		return content;
	}

}

//this is the component that displays a full card. The main event. Show time.
class CardViewer extends Component{

	constructor(slug){
		super();
		this.slug = slug;
		this.sendingEmail = false;
	}

	//if the user is on the search page render a message component that explains that that is where your viewed cards will be displayed
	//otherwise just view the card
	onRender(){
		if(this.slug=="search"){
			$("#cardHeading").html("Search Results");
			new MessageComponent("Your search results will appear here", "").render("cardDisplay");
			return;
		}
		this.view(this.slug);
	}

	//render the text above the card that either says "your card" or the card owner's name
	getContent(){
		let content = $("<div/>");
		let heading = "Your Card";
		content.append($("<h1/>").html("").attr("id", "cardHeading"));
		content.append($("<div/>").attr("id", "cardDisplay"));
		return content;
	}

	//this function returns a card data JSON object based on a supplied URL
	//if theres an empty URL and you're logged in display your card
	async getCardData(cardUrl){
		if(cardUrl=="/")cardUrl = "/"+page.user.public.customURL;
		cardUrl = cardUrl.substring(1);
		console.log("get Card "+cardUrl);
		return new Promise(resolve => {
    		$.post(`/api/get-card-by-slug`, {"slug": cardUrl}, (data) => {
    			if(data.error!=""){
    				//console.log(data);
    				console.log("I bet you're wondering how I ended up in this situation " + cardUrl);
    				resolve(false);
    				return;
    			}
    			resolve(data.card)
    		});
  		});
	}

	//this function swaps the card in and out with a ~pretty~ animation given a slug
	//this function is responsable for actually calling getCardData
	//this function is also responsable for displaying an error message assuming the card doesn't exist
	async view(slug){

		let display = $("#cardDisplay");
		let cardData = await this.getCardData(slug);
		if(cardData==false){
		//	console.log(page);
		//	console.log(page.user);
			display.empty();
			//$("#cardHeading").remove();
			if(page.user!=false && (page.getUrl()=="/" || page.getUrl()=="/"+page.user.public.customURL)){
				//$(display).append($("<h1/>").text("You don't have a card!"));
				$("#cardHeading").text("You don't have a card!");
				let message = "If you want to create your card, click <a href='/create' style='padding-right:0px'>here</a>";
				new MessageComponent("This card doesn't exist!", message).render("cardDisplay");
			}else{
				//$(display).append($("<h1/>").text("Card not found :/"));
				$("#cardHeading").text("Card not found :/");
				let message = "If you would like to register an account with this url, click <a href='/register' style='padding-right:0px'>here</a>";
				new MessageComponent("This card doesn't exist!", message).render("cardDisplay");
				document.title = "404: Card not found!"
			}

			return;
		}
		console.log(cardData);



		if(display.length > 0){
			display.fadeOut(500, ()=>{
				display.empty();
				this.showCard(cardData);
				display.fadeIn(500);
			});
		}else{
			display.hide();
			display.empty();
			showCard(cardData);
			display.fadeIn(500);
		}

	}

	//this function sends the verify email
	//it's weird to have this here, but I didn't want to attach the verify email to the card itself,
	//because I didn't want to further complicate the cards alreadly convoluted getContent() function
	async verifyEmail(){
		if(this.sendingEmail){
			alert("We'll get there when we get there! Wait!");
			return;
		}
		this.sendingEmail = true;
		let result = await this.awaitPost("resend-verification-email");
		if(result.error!=""){
			alert("Error! Could not resend email! "+result.error);
		}else{
			alert("Go check your email ;)");
		}
		this.sendingEmail = false;
	}

	//this function is responible for rendering the full card component given a cardData JSON object
	showCard(cardData, collapseAll=true){
		let card = new Card(cardData)
		if(!card.myCard)document.title = `${card.user.firstName} ${card.user.lastName}'s Card`
		else document.title = "My Card";
		if(card.myCard && page.user.currentAccountStatus==1){
			let msgParts = ["Didn't get an email? Click ", $("<a/>").click(()=>{this.verifyEmail()}).text("here")];
			new MessageComponent("Verify your email to publish your card!", msgParts).render("cardDisplay");
			$("#cardDisplay").append("<br>");
		}


		card.render("cardDisplay");
		let headingText = `${card.user.firstName}'s Card`
		if(card.myCard)headingText = "Your Card";
		$("#cardHeading").html(headingText);


		if(collapseAll){
			for(let button of card.getButtons()){
				//We do not want to accidentally save some rando's card when collaping all actions
				if(button!="Save" && button!="UnSave" && button!="Settings")card.toggleAction(button, true);
			}
		}
	}

}

//GET YOUR PIPING FRESH HOT CARDS HERE
class HotCards extends Component{

	async onRender(){
		let hotCards = await this.awaitPost("hot-cards");
		for(let sexyCard of hotCards.cards){
			new Card(sexyCard, true).render("hotResults_he_he");
		}
	}

	getContent(){

		//create card div
		let content = $("<div/>", {
			"class" : "box"
		});

		content.append($("<div/>",{
			"id": "hotResults_he_he",
			"css":{
				padding:"10px"
			}
		}));


		return content;
	}
}

//The component that allows the user to search the entire site / through their saved cards
class Search extends Component{

	//type is whether or not the search is thru favorited cards or thru the whole site
	constructor(searchText=undefined, type = "none"){
		super();
		this.searchText = searchText;
		this.light = (type=="light");
		this.myCards = (type=="myCards");

	}

	//when the component is rendered show some blank cards
	onRender(){
		if(this.myCards)this.showResults("", 6);
	}

	//triggers show results based on inputted query
	typed(){

		let query = $("#search").val();
		this.showResults(query, query.length)

	}



	//render card components based on query
	showResults(query, dupe = -1){
		if(dupe==-1)dupe = query.length;
		dupe = 1;

		let request = {textQuery: query, tags:[], isMyCards: this.myCards, pageNumber: 0};

		this.post("search-card", request, (results) => {

			$("#results").fadeOut(500,() => {
				$("#results").html("");

				for(var result of results.cards){

					new Card(result, true).render("results");

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
		if(!this.myCards || this.searchText==undefined)content.append($("<h2/>", {text: this.searchText}));

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

//The component that displays the stats of your card
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
		content.append($("<h1/>").html(`<span style='color: #29b6f6'>${page.user.public.firstName}'s</span> Stats`));

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

//component that displays details of the card
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

//component that displays the social media links of any card
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

//component that holds the settings of your card
class CardSettings extends Component{

	constructor(published){
		super();
		this.waiting = false;
		this.published = published;
	}

	//function swaps the card visibility
	async change(e){
		if(this.waiting){
			$("#publish").val(this.ogValue);
			return;
		}
		this.waiting = true;
		if(page.user.currentAccountStatus==1){
			alert("You cannot change your account visibility until your email is verified!")
			this.onRender();

		}else{
			let result = await this.awaitPost("set-card", {published: ($("#publish").val()=="Published")});
			//console.log(result);
			if(result.error!=""){
				alert("Could not change your card visibility! : "+result.error);
				$("#publish").val(this.ogValue);
			}
		}
		this.waiting = false;
	}

	//sets origonal value of the publish button
	focus(){
		this.ogValue = $("#publish").val();
	}

	//when the component is created display either UnPublished or published
	onRender(){
		if(page.user.currentAccountStatus==1)$("#publish").val("UnPublished");
		else {
			$("#publish").val((this.published) ? "Published": "UnPublished" );
		}
		this.ogValue = $("#publish").val();
	}

	//deletes your card
	async deleteCard(){
		if(window.confirm("Are you sure you want to delete your card?")){
			if(window.confirm("Ok, but like, for real for real?")){
				let result = await this.awaitPost("delete-card");
				if(result.error!=""){
					alert("There was an error deleting your card! "+result.error);
				}else{
					alert("Your card was deleted successfully!");
					page.navigate("/");
				}
			}
		}
	}

	getContent(){
		//create card
		let content = $("<div/>", {
			"id": "Settings",
			"class": "box"
		});

		//add heading
		content.append($("<h1/>").html(`<span style='color: #29b6f6'>Card</span> Settings`));
		content.append($("<hr/>"));
		content.append("<b>Card Visibility: </b>");
		content.append($("<select/>", {id: "publish",focus:()=>{this.focus()}}).html([
			$("<option/>").attr("id","pub").text("Published"),
			$("<option/>").attr("id","pub").text("UnPublished")//.attr("selected","false"),
		])).on("change", (e)=>{this.change(e)});

		//add delete card button
		content.append("<hr>");
		content.append("<b>Danger Zone: </b>");
		content.append($("<a/>").text("Delete Card").css({"fontWeight":"bold", "color":"red"}).click(()=>{this.deleteCard()}));

		content = $("<div/>").html([content, "<br>"]);
		return content;
	}

}

//display navbar
class NavBar extends Component{
	constructor(){
		super();

	}

	//logs the user out
	async logout(){
		await this.awaitPost("logout", {});
		window.location.replace("/");
	}

	//renders navabar
	getContent(){
		let content = $("<div/>").css("width", "100%");
		//render buttons based on whether or not the user is logged in
		let buttons = [

			$("<a/>", {click:()=> page.navigate("/"), text: "Passport"}).css("float", "left").css("marginLeft",35),
			$("<a/>", {click:()=> this.logout(), text: "Logout"}).css("float", "right"),
			$("<a/>", {click:()=> page.navigate("/search"), text: "Search"}).css("float", "right"),
		];
		if(page.user==false){
			buttons = [
				$("<a/>", {click:()=> window.location.replace("/register"), text: "Register For Passport"}).css("float", "left").css("marginLeft",35),
				$("<a/>", {click:()=> page.navigate("/"), text: "Home"}).css("float", "right"),
				$("<a/>", {click:()=> page.navigate("/faq"), text: "FAQ"}).css("float", "right"),
				$("<a/>", {click:()=>  page.navigate("/aboutus"), text: "About Us"}).css("float", "right"),
			];
		}
		let innerDiv = $("<div/>").html(buttons).css({"width": "100%", postion:"fixed"});
		content.html(buttons);

		return content;
	}

	replaceContainer(){
		return true;
	}

}



//This component represents any card, if it's "light" it's small if it's regular it displays the full card
//light is used for searches & hotcards
class Card extends Component{

	constructor(card, light = false){
		super();
		this.card = card;

		this.user = this.card.ownerInfo;
		this.light = light;


		this.myCard = this.card.ownerID == page.user.uuid;

		//these variables are here to ensure you can't favorite / save while you're still waiting for the server response
		//from the first save
		this.waitingForSave = false;
		this.waitingForFavorite = false;

		this.favorited = page.getFavorite(this.card.cardID);

		//the actions (buttons at the bottom of card ) and what functions they map to
		this.actions = {
			"Details": new CardDetails(this.card.content.tags),
			"Social": new CardSocial(this.card.ownerInfo.firstName, this.card.content.socialMediaLinks),
			"Stats": new CardStats(this.card.stats),
			"Settings": new CardSettings(this.card.content.published),
			"View": (target)=>{this.viewCard()},
			"Save": (target)=>{this.toggleSaveCard(target)},
			"UnSave": (target)=>{this.toggleSaveCard(target)}
		}

	}

	//this returns a list of the button text that goes on the card (this varies based on if the card is light or not)
	getButtons(){
		let toSave = (page.user == false || !page.hasSaved(this.card.cardID)) ? "Save" : "UnSave";
		let buttons = (!this.light) ? ["Details", "Social", (this.myCard) ? "Stats" : toSave] : ["View", toSave];
		if(this.myCard)buttons.push("Settings");
		return buttons;
	}

	//this navigates the CardViewer on the page to this card.  This is only used if it is a light card
	viewCard(){
		page.navigate("/"+this.card.ownerInfo.customURL);
	}

	//Util function: Given the word Save or Unsave it returns the reverse of it.
	toggleSaveWord(word){
		return (word=="Save") ? "UnSave" : "Save";
	}

	//this is called when a memo is typed in the memo box
	async typed(event){
		if(event.key=="Enter"){
			if($("#memoBox").val()==""){
				$("#memoBox").remove();
				return;
			}
			let memo = $("#memoBox").val();
			let memoPost = {cardID: this.card.cardID, memoText: memo};
			console.log(memoPost);
			let result = await this.awaitPost("set-memo", memoPost);
			if(result.error!=""){
				alert("Error saving memo: "+result.error);
			}else{
				$("#memoBox").remove();
				for(let i =0 ; i<page.user.savedCards.length; i++){
					let card = page.user.savedCards[i];
					if(card.cardID == this.card.cardID){
						card["memo"] = memo;
						break;
					}
				}
				page.updateMemos(this.card.cardID, memo);
			}
		}else if(event.key=="Escape"){
			$("#memoBox").remove();
		}
	}

	//this saves / unsaves a card.
	// the backend parameter is there for when you just want to swap the text (like when you favorite a card, bedcause favoriting automagically saves it)
	async toggleSaveCard(target, backend=true){
		if(this.waitingForSave)return;

		//if user isn't logged in, guilt them into signing up
		if(page.user == false){
			alert("Login or Sign up to save cards!");
			return;
		}

		this.waitingForSave = true;
		let saveWord = target.text();

		//create memo text box if they have just saved a card
		$("#memoBox").remove();
		if(saveWord=="Save"){
			let memoText = "Type a memo and hit enter or leave it blank";
			$("#"+this.propId).append($("<input/>", {placeholder:memoText, "id":"memoBox", on: {keypress: (e) => {this.typed(e)}} }).attr("class", "tinytextbox"));
			$("#memoBox").focus();
		}

		target.text(this.toggleSaveWord(saveWord));

		//if it's backend=true send what we did to the backend
		if(backend){
			let saveResult = await this.awaitPost("toggle-save", {cardID: this.card.cardID});
			if(saveResult.error!=""){
				//if the save fails alert error and reverse saveword
				let saveWord = target.text();
				target.text(this.toggleSaveWord(saveWord));
				alert("An error occoured when attempting to save this card: "+saveResult.error);
			}else{
				//refresh feed if successful

				if(target.text()=="UnSave"){
					//add to cached saved cards if they've saved
					let cardVal = {cardID: this.card.cardID, favorited: "false", memo:""};
					page.user.savedCards.push(cardVal);

				}else{
					//remove from cached saved cards if they've unsaved
					for(let i =0 ; i<page.user.savedCards.length; i++){
						if(page.user.savedCards[i].cardID == this.card.cardID){
							page.user.savedCards.splice(i, 1);
							break;
						}
					}
					//update the text of any cards that are on the screen that have been effected by this function
					page.updateFavorites(this.card.cardID, false);
					page.updateMemos(this.card.cardID, false);

				}
					//update the text of any cards that are on the screen that have been effected by this function
				page.updateSaves(this.card.cardID, target.text());
				let savedCardComponent = page.getComponent("Search");
				if(savedCardComponent!= false && savedCardComponent.myCards){

					savedCardComponent.showResults("");
				}

				//console.log(savedCardComponent);
			}
		}else{

		}
		this.waitingForSave = false;
	}

	//if they've clicked on an action that is tied to a component (eg: social, details, etc) render/derender the corrosponding component
	//forceRender ensures that it's not toggled and renders it regaurdless of if the component is on the page or not
	toggleAction(actionName, forceRender=false, clicked = undefined){

		let action = this.actions[actionName];
		if(action instanceof Component){
			if(!($("#"+actionName).length) || forceRender){

				action.render("action-"+actionName, true);
			}else{
				action.deRender();
			}
		}else{
			action(clicked);
		}
	}

	//Util: gets random integer
	getRandomInt(max) {
  		return Math.floor(Math.random() * Math.floor(max));
	}


	//this function favorites / unfavorites any card
	async toggleFavorite(){
		//return if we haven't recieved a result from the last attempt to favorite
		if(this.waitingForFavorite)return;
		this.waitingForFavorite = true;
		this.favorited = !this.favorited;
		$("#"+this.starId).attr("class", "fa fa-star").show();

		let results = await this.awaitPost("toggle-favorite", {"cardID": this.card.cardID});
		for(let card of page.user.savedCards){
				if(card.cardID == this.card.cardID){
					//alert("Y");
					card.favorited = this.favorited;
				}
			}
			if(!page.hasSaved(this.card.cardId)){
			this.toggleSaveCard($("#"+this.saveId), false);
		}
		if(!results.error==""){
			alert("error favoriting: "+results.error);
			this.favorited = !this.favorited;
		}else{

			page.updateFavorites(this.card.cardID, this.favorited);
			let savedCardComponent = page.getComponent("Search");
			if(savedCardComponent.myCards)savedCardComponent.showResults("");
		}
		this.waitingForFavorite = false;
	}

	//this function returns the actual card html
	getContent(){
		//create content div
		let content = $("<div/>").attr("class", "card");
		let heading = (this.light) ? "h3" : "h2";

		//add profile pic to card
		let color = "29b6f6";
		let nameQuery = `${this.user.firstName}+${this.user.lastName}`;
		//let prfoilePicUrl =`https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=${nameQuery}&size=300&background=${color}&bold=true&color=FFFFF`;
		let prfoilePicUrl = this.card.ownerInfo.profilePictureURL;
		//fix
		//if(!prfoilePicUrl.includes("&format=png"))prfoilePicUrl+="&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"

		content.append($("<div>", {
			"class": "profilePic",
			html: $("<img/>").attr("src", prfoilePicUrl)
		}));

		//add first and last name heading to card
		this.starId = "star-"+this.card.cardID+"-"+this.getRandomInt(99999);
		let nameDiv = $("<div/>", {
			"class": "name",
			html: [
				$(`<${heading}/>`).text(`${this.user.firstName} ${this.user.lastName}`),
				$('<i class="far fa-star"/>', {
				}).css("margin-bottom","5px").css("margin-left","5px").css("color", "#f5da2a").css("cursor","pointer").attr("id", this.starId).mouseenter((e)=>{
					if(!this.favorited)$(e.target).attr("class", "fa fa-star");
					//this.attr("class", "fa fa-star")
				}).mouseleave((e)=>{
					if(!this.favorited)$(e.target).attr("class", "far fa-star");
					//this.attr("class", "fa fa-star")
				}).click((e)=>this.toggleFavorite(e)).hide()
			]
		}).mouseenter( ()=>{if(page.user!=false)$("#"+this.starId).show()} ).mouseleave( ()=>{if(!this.favorited)$("#"+this.starId).hide()} );
		content.append(nameDiv)
		//this.favorited=true;
		if(this.favorited){
			//alert("wef");
			nameDiv.show();
			//nameDiv.contents().show().contents().attr("class", "fa fa-star");
			console.log($(nameDiv.contents()[1]).show().attr("class", "fa fa-star"));
			//console.log($("#"+this.starId).attr("id"))
		}
		//add card properties
		this.propId = "props-"+this.card.cardID+"-"+this.getRandomInt(99999);
		let props = $("<div/>").attr("id", this.propId).attr("class", "properties");


		for(const property of this.card.content.cardProperties){
			let key = property.key;
			let value = property.value;
			props.append(`${key}: ${value}<br>`);
		}

		//check if I've saved a card with a memo and if so add it to properties
		let memo = page.getMemo(this.card.cardID);
		let memoText = (memo!=false) ? `"${memo}"` : "";
		props.append($("<span/>").text(memoText).attr("class", "memo").attr("id", "memo-"+this.card.cardID));

		content.append(props)

		//add card buttons
		let buttons = $("<div/>").attr("class", "buttons");
		this.saveId= "save-"+this.card.cardID+"-"+this.getRandomInt(99999);
		for(const button of this.getButtons()){
			let link = $("<a/>", {text: button, click:(e)=>this.toggleAction(button, false, $(e.target))});
			if((button=="Settings" && this.light) || (this.myCard && button=="Save")) continue;
			if(button=="Save" || button=="UnSave")link.attr("id", this.saveId);
			if(button=="Settings" )buttons.append($("<span/>").text(" |").css({"paddingRight": "12px", "color": "darkgrey"}));
			buttons.append(link);

		}

		content.append(buttons);

		//if this is a full/non-light card, wrap it in a div, and add another div to hold the card actions (details, social, etc)
		if(!this.light)	{
			let oldContent = content.attr("class", "box card");
			//TODO: add divs so order stays the same
			content = $("<div/>").html([oldContent]);
			content.append($("<br>"));
			content.append($("<div/>").attr("id", "action-Settings"));
			content.append($("<div/>").attr("id", "action-Social"));
			content.append($("<div/>").attr("id", "action-Stats"));
			content.append($("<div/>").attr("id", "action-Details"));
		}
		return content;
	}


}
