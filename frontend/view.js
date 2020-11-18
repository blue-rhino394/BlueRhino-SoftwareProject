//Base view is class
//The view class determines what components are on any given page, and where they are rendered
//view class also determines what HTML template to use to store the componets inside of
class View {


	//this method renders a view
	//it does this by first doing a get request for the html file returned by getView function
	//then it goes thru the list of componets from the getComponents() and renders them
	async render(){

		let view = await this.loadTemplate(this.getView());
		page.components = [];

		$("#content").html(view);


		for (let [key, component] of Object.entries(this.getComponents())) {
			try{

				component.render(key);
			}catch(err){
				console.error(err);
				new ErrorComponent(err).render(key);
			}
		}

	}

	//this function is to be overridden by child views
	//it returns the page title
	getTitle(){
		return false;
	}

	//this function returns the HTML of a given template specified by name
	async loadTemplate(name){
		return new Promise(resolve => {
    		$.get(`/templates/${name}.html`, (data)=> resolve(data));
  		});
	}

	//this function is to be overridden by child views
	//it returns a JSON where the key is the ID of the element where the component should be rendered and the value is a new instance of the componet that is rendered
	getComponents(){}

	//this function should be overrided by child views
	//it returns a string that corrosponds to the template that the view should use to render components in
	getView(){}



}

//Home view is the view that is rendered when you're viewing a card
//EX: HomeView is rendered if you go to brhino.org/marc
class HomeView extends View{

	constructor(slug=""){
		super();
		if(slug=="")slug = "/"+page.user.public.customURL;
		this.slug = slug;
	}

	getView(){
		return "home";
	}

	getTitle(){
		return "Passport.";
	}


	getComponents(){

		return {
			"side" : (page.user!=false) ? new Search("Saved Cards", "myCards") : new Login(),
			"main" : new CardViewer(this.slug),
			"navBar" : new NavBar()
		}
	}


}

//This view is rendered when the user navigates to /faq
class FAQView extends View{

	getView(){
		return "faq";
	}

	getTitle(){
		return "FAQ";
	}


	getComponents(){

		return {
			"navBar" : new NavBar()
		}
	}



}

//This view is rendered when the user navigates to /aboutus
class AboutView extends View{

	getView(){
		return "aboutus";
	}

	getTitle(){
		return "About Us";
	}

	getComponents(){

		return {
			"navBar" : new NavBar()
		}
	}

}

//This view is rendered when the user navigates to /search
class SearchView extends View{

	getView(){
		return "search";
	}

	getTitle(){
		return "Search";
	}


	getComponents(){

		return {
			"side" : new Search("Search"),
			"main" : new CardViewer("search"),
			"navBar" : new NavBar()
		}
	}



}


//this view is rendered when the user is not logged in and the go to brhino.org/ 
class LoginView extends View{

	getView(){
		return "login";
	}

	getTitle(){
		return "Passport.";
	}

	getComponents(){

		return {
			"side" : new Login(),
			"main" : new Search("Search", "light"),
			"navBar" : new NavBar(),
			"hotMain" : new HotCards()
		}
	}



}
