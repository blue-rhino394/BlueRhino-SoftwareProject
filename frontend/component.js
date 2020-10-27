class Component {

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
				//console.log("here");
				location.fadeIn(500);
			}
		}catch(err){
			console.error(err);
			new ErrorComponent(err).render(locationId);
		}
	
		return content;
	}


	replaceContainer(){
		return false;
	}

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

	loginWrapper(){
		this.login();
	}

	onRender(){
		$("#SavedText").text("Sign in to Save Cards");
	}

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


class MessageComponent extends Component{

	constructor(title, message=""){
		super();
		this.title = title;
		this.message = message;
	}

	getContent(){
		let content = $("<div/>").attr("class", "box");
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

class CardViewer extends Component{
	
	constructor(slug){
		super();
		this.slug = slug;
		this.sendingEmail = false;
	}

	onRender(){
		if(this.slug=="search"){
			$("#cardHeading").html("Search Results");
			new MessageComponent("Your search results will appear here", "").render("cardDisplay");
			return;
		}
		this.view(this.slug);
	}

	getContent(){
		let content = $("<div/>");
		let heading = "Your Card";
		content.append($("<h1/>").html("").attr("id", "cardHeading"));
		content.append($("<div/>").attr("id", "cardDisplay"));
		return content;
	}

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

	async view(slug){

		let display = $("#cardDisplay");
		let cardData = await this.getCardData(slug);
		if(cardData==false){
		//	console.log(page);
		//	console.log(page.user);
			if(page.getUrl()=="/" || page.getUrl()=="/"+page.user.public.customURL){
				$("#"+this.location).append($("<h1/>").text("You don't have a card!"));
			
				let message = "If you want to create your card, click <a href='/create' style='padding-right:0px'>here</a>";
				new MessageComponent("This card doesn't exist!", message).render(this.location);
			}else{
				$("#"+this.location).append($("<h1/>").text("Card not found :/"));
			
				let message = "If you would like to register an account with this url, click <a href='/register' style='padding-right:0px'>here</a>";
				new MessageComponent("This card doesn't exist!", message).render(this.location);
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
			showCard(cardData);
			display.fadeIn(500);
		}

	}

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

	showCard(cardData, collapseAll=true){
		let card = new Card(cardData)

		if(card.myCard && page.user.currentAccountStatus==1){
			let msgParts = ["Didn't get an email? Click ", $("<a/>").click(()=>{this.verifyEmail()}).text("here")];
			new MessageComponent("Verify your email to publish your card!", msgParts).render("cardDisplay");
			$("#cardDisplay").append("<br>")
		}


		card.render("cardDisplay");
		let headingText = `${card.user.firstName}'s Card`
		if(card.myCard)headingText = "Your Card";
		$("#cardHeading").html(headingText);

	
		if(collapseAll){
			for(let button of card.getButtons()){
				//We do not want to save some rando's card when collaping all actions
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

class Search extends Component{
	
	constructor(searchText=undefined, type = "none"){
		super();
		this.searchText = searchText;
		this.light = (type=="light");
		this.myCards = (type=="myCards");

	}

	onRender(){
		if(this.myCards)this.showResults("", 6);
	}

	typed(){

		let query = $("#search").val();
		this.showResults(query, query.length)
		
	}

	


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

		//connect.sid
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


class CardSettings extends Component{

	constructor(published){
		super();
		this.waiting = false;
		this.published = published;
	}

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

	focus(){
		this.ogValue = $("#publish").val();
	}

	onRender(){
		if(page.user.currentAccountStatus==1)$("#publish").val("UnPublished");
		else {
			$("#publish").val((this.published) ? "Published": "UnPublished" );
		}
		this.ogValue = $("#publish").val();
	}

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
		
		content.append("<hr>");
		content.append("<b>Danger Zone: </b>");
		content.append($("<a/>").text("Delete Card").css({"fontWeight":"bold", "color":"red"}).click(()=>{this.deleteCard()}));

		content = $("<div/>").html([content, "<br>"]);
		return content;
	}

}


class NavBar extends Component{
	constructor(){
		super();

	}

	async logout(){
		//alert("");
		await this.awaitPost("logout", {}); 
		window.location.replace("/");
	}

	getContent(){
		let content = $("<div/>").css("width", "100%");
		let buttons = [

			$("<a/>", {click:()=> page.navigate("/"), text: "Passport"}).css("float", "left").css("marginLeft",35),		
			$("<a/>", {click:()=> this.logout(), text: "Logout"}).css("float", "right"),
			$("<a/>", {click:()=> page.navigate("/search"), text: "Search"}).css("float", "right"),
		];
		if(page.user==false){
			buttons = [
				$("<a/>", {click:()=> window.location.replace("/register"), text: "Register For Passport"}).css("float", "left").css("marginLeft",35),		
				$("<a/>", {click:()=> window.location.replace("/faq"), text: "FAQ"}).css("float", "right"),
				$("<a/>", {click:()=>  window.location.replace("/aboutus"), text: "About Us"}).css("float", "right"),
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




class Card extends Component{

	constructor(card, light = false){
		super();
		this.card = card;
		
		this.user = this.card.ownerInfo;
		this.light = light;
		

		this.myCard = this.card.ownerID == page.user.uuid;

		this.waitingForSave = false;
		
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

	
	getButtons(){
		//details : Tags
		//Social : social media links
		//Stats: card stats
		let toSave = (page.user == false || !page.hasSaved(this.card.cardID)) ? "Save" : "UnSave";
		let buttons = (!this.light) ? ["Details", "Social", (this.myCard) ? "Stats" : toSave] : ["View", toSave];
		if(this.myCard)buttons.push("Settings");
		return buttons;
	}

	viewCard(){
		//page.getCardViewer().view(this.card);
		//this.card.customURL="gfreezy";
		console.log(this.card);
		page.navigate("/"+this.card.ownerInfo.customURL);
	}

	toggleSaveWord(word){
		return (word=="Save") ? "UnSave" : "Save";
	}

	//guy we force to write down cards

	//when stuff is typed in the memo box
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

	async toggleSaveCard(target){
		if(this.waitingForSave)return;

		if(page.user == false){
			alert("Login or Sign up to save cards!");
			return;
		}
		
		this.waitingForSave = true;
		let saveWord = target.text();

		$("#memoBox").remove();
		if(saveWord=="Save"){
			let memoText = "Type a memo and hit enter or leave it blank";
			$("#"+this.propId).append($("<input/>", {placeholder:memoText, "id":"memoBox", on: {keypress: (e) => {this.typed(e)}} }).attr("class", "tinytextbox"));
			$("#memoBox").focus();
		}

		target.text(this.toggleSaveWord(saveWord));
		let saveResult = await this.awaitPost("toggle-save", {cardID: this.card.cardID});
		if(saveResult.error!=""){
			let saveWord = target.text();
			target.text(this.toggleSaveWord(saveWord));
			alert("An error occoured when attempting to save this card: "+saveResult.error);
		}else{
			//refresh feed if successful 
			
			if(target.text()=="UnSave"){
				let cardVal = {cardID: this.card.cardID, favorited: "false", memo:""};
				page.user.savedCards.push(cardVal);

			}else{
				for(let i =0 ; i<page.user.savedCards.length; i++){
					if(page.user.savedCards[i].cardID == this.card.cardID){
						page.user.savedCards.splice(i,1);
						break;
					}
				}
				page.updateMemos(this.card.cardID, false);
			}
			let savedCardComponent = page.getComponent("Search");
			if(savedCardComponent!= false && savedCardComponent.myCards){
				savedCardComponent.showResults("");
			}

			//console.log(savedCardComponent);
		}
		this.waitingForSave = false;
	}

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

	getRandomInt(max) {
  		return Math.floor(Math.random() * Math.floor(max));
	}



	getContent(){
		//create content div
		let content = $("<div/>").attr("class", "card");
		let heading = (this.light) ? "h3" : "h2";

		//add profile pic to card
		let color = "29b6f6";
		let nameQuery = `${this.user.firstName}+${this.user.lastName}`;
		console.log();
		//let prfoilePicUrl =`https://ui-avatars.com/api/?font-size=0.33&format=png&rounded=true&name=${nameQuery}&size=300&background=${color}&bold=true&color=FFFFF`;
		let prfoilePicUrl = this.card.ownerInfo.profilePictureURL;
		//fix 
		//if(!prfoilePicUrl.includes("&format=png"))prfoilePicUrl+="&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"

		content.append($("<div>", {
			"class": "profilePic",
			html: $("<img/>").attr("src", prfoilePicUrl)
		}));

		//add first and last name heading to card
		content.append($("<div/>", {
			"class": "name",
			html: $(`<${heading}/>`).text(`${this.user.firstName} ${this.user.lastName}`)	
		}));

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
		for(const button of this.getButtons()){
			let link = $("<a/>", {text: button, click:(e)=>this.toggleAction(button, false, $(e.target))});
			//if(button=="Settings")link.css("marginLeft","5px");
			if(button=="Settings")buttons.append($("<span/>").text(" |").css({"paddingRight": "12px", "color": "darkgrey"}));
			buttons.append(link);
			
		}

		content.append(buttons)

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