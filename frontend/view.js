class View {

	render(){
		$("#content").html(this.getView());
		for (let [key, component] of Object.entries(this.getComponents())) {

  			component.render(key); 
		}
	}

	getComponents(){}
	getView(){}


}

class HomeView extends View{

	getView(){
		return $("<div/>")
            	.attr("id", "mainPanel");
	}

	getComponents(){
		return {
			"mainPanel" : new TestComponent(1)
		}
	}


}

class HomeView2 extends View{

	getView(){
		return $("<div/>")
            	.attr("id", "mainPanel");
	}

	getComponents(){
		return {
			"mainPanel" : new TestComponent(2)
		}
	}


}