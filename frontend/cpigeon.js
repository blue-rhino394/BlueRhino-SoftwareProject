


window.onload = function() {
 	page = new CPigeon(); 
};


window.onpopstate = function () {
	page.navigate(page.getUrl(), false);
}



class CPigeon {

	constructor() {
		this.user = {
			name : "",
			url: "",
			profilePictureUrl: "",		
		};
		this.pageMap = this.getPageMaps();
		
		
		this.navigate(this.getUrl(), false);
  	}

 


  	navigate(page, pushState=true){
  		if(pushState)window.history.pushState("", "", page);
  		this.pageMap[page].render();

  	}



  	getUrl(){
  		return window.location.pathname;
  	}

  	getPageMaps(){
  		return {
  			"/":new HomeView(),
  			"/next":new HomeView2()
  		}
  	}

}