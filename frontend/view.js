class View {

	async render(){


		this.data = await this.getData();

		let view = await this.loadImport(this.getView());
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


	getTitle(){
		return false;
	}


	async loadImport(name){
		return new Promise(resolve => {
    		$.get(`/templates/${name}.html`, (data)=> resolve(data));
  		});
	}

	getComponents(){}
	getView(){}
	async getData(){}
	getTemplates(){}


}

class HomeView extends View{

	constructor(slug=""){
		super();
		if(slug=="")slug = "/"+page.user.public.customURL;
		//if(slug=="")slug = "mhewitt836";

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
