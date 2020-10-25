class View {

	async render(){

	
//		this.data = await this.getData();

		let view = await this.loadImport(this.getView());
		page.components = [];

		$("#content").html(view);
		

		
		for (let [key, component] of Object.entries(this.getComponents())) {
			try{
				page.components.push(component);
				component.render(key); 
			}catch(err){
				console.error(err);
				new ErrorComponent(err).render(key);
			}
		}
	

		
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

/*
	async getData(){
		return new Promise(resolve => {
    		$.post(`/api/get-card`, {"":""},(data) => resolve(data.card));
  		});
	}*/

	getComponents(){

		return {
			"side" : new Search("Saved Cards", "myCards"),
			"main" : new CardViewer(this.slug),
			"navBar" : new NavBar()
		}
	}


}

class SearchView extends View{

	getView(){
		return "search";
	}

	getComponents(){

		return {
			"side" : new Search(),
			"main" : new CardViewer("search"),
			"navBar" : new NavBar()
		}
	}



}

class LoginView extends View{

	getView(){
		return "login";
	}

	getComponents(){

		return {
			"side" : new Login(),
			"main" : new Search("Discover Passport", "light"),
		}
	}



}