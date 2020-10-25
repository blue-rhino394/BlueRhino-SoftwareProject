


window.onload = function() {
    page = new CPigeon(); 
};


window.onpopstate = function () {
    page.navigate(page.getUrl(), false);
}



class CPigeon {

    constructor() {
        //json to hold user data
        this.user = false;
        //list of components that are rendered by view 
        this.components = [];
        this.releasePigeon();
        
    }

    //method that starts everything
    async releasePigeon(){

        let postResult = await this.post("login");
        if(postResult.error == "") {
            
            this.user = postResult;
        }else{
            console.log(postResult.error);
        }
        this.navigate(this.getUrl(), false);
            
      
    }


    /* Awaitable post request*/
    async post(endpoint, json={}){
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
    /*
        this method navigates to a page by finding the appropreate view in getPageMaps, renders the view 
        and deRenders the components in the old view.  Also adds the current page to navigation stack
    */
    navigate(page, pushState=true){
        
        if(pushState)window.history.pushState("", "", page);

       
        //let cardViewerPages = ["About"];
        let cardViewer = this.getCardViewer();
        if(cardViewer!=false /*&& page*/){
            cardViewer.view(page);
        }else{
            $("#content").fadeOut(500, () => {
                let pageView = this.getPageMaps()[page];
                //if there is no route avaible for current page, use the '*' route 
                if(pageView==undefined) pageView = this.getPageMaps()["*"];
                pageView.render();
                $("#content").fadeIn(500);
            });
        }
   

    }


    getCardViewer(){
        for(const component of this.components){
            if(component instanceof CardViewer){
                return component;
            }
        }
        return false;
    }

    //returns the slug of the page
    getUrl(){
        return window.location.pathname;
    }

    //routes 
    getPageMaps(){
        return {
            "/": (this.user != false) ? new HomeView() : new LoginView(),
            "/search":(this.user != false) ? new SearchView() : new LoginView(),
            "*": new HomeView(this.getUrl())
        }
    }

}