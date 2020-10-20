class View {

	async render(){

		//<link rel="import" href="http://example.com/elements.html">
		//$("#head").append('<link rel="import" href="/components/test.html">');
		
		this.data = await this.getData();
		let view = await this.loadImport(this.getView());
		$("#content").html(view);
		
		for (let [key, component] of Object.entries(this.getComponents())) {

			component.render(key); 
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
			"side" : new Search("Saved Cards", "favorite"),
			"main" : new CardViewer("")
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