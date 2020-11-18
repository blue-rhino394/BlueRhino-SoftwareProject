

//when the page loads, initialise CPigeon and make it globally accessable thru the "page" variable
window.onload = function() {
    page = new CPigeon();
};

//whenever the back button is pressed, navigate to the new URL thru carrier pigeon
window.onpopstate = function () {
    page.navigate(page.getUrl(), false);
}



/*
the carrier pigeon engine class.
Controls [single] page navigation and holds page/user state information
when you go to any page on the site carrier pigeon first determines what View to render, and then renders said View with the appropreate paramters
A View is class that determines what components are on any given page, and where they are rendered

the lifecycle is as follows:

user navigates to site --> CPigeon determines what view to render based on URL & login status --> View renders Components --> Components display data from the backend 

*/
class CPigeon {

    constructor() {
        //json to hold user data
        this.user = false;
        //list of components that are rendered by view
        this.components = [];

        this.releasePigeon();

    }

    //method that starts everything
    //first it makes a call to login w/ no paramters, if it's a success that means I'm already logged in
    //and I can set the page's user variable to whatevr the server replied with, otherwise the user varible's remains false to indicated you're not logged in
    async releasePigeon(){

        let postResult = await this.post("login");
        if(postResult.error == "") {
            let savedCardsRequest = {textQuery:"", tags:[], isMyCards: true, pageNumber: 0};
            this.user = postResult;
            console.log(this.user);
        }else{
            console.log(postResult.error);
        }
        this.navigate(this.getUrl(), false);


    }


    //function for checking if the user has saved a card
    hasSaved(cardId) {

        for(const card of this.user.savedCards){

            if(card.cardID == cardId)return true;

        }
        return false;
    }

    //this function returns if a card is favorited or not given an ID
     getFavorite(cardId) {
        if(this.user==false)return false;
        for(const card of this.user.savedCards){
             //console.log(card.cardID+" vs "+cardId);
            if(card.cardID == cardId)return card.favorited;

        }
        return false;
    }

    //function returns the user's memo for a card given an Id, false if there's no memo or if they havent saved the card
    getMemo(cardId) {
        if(this.user==false)return false;
        for(const card of this.user.savedCards){
             //console.log(card.cardID+" vs "+cardId);
            if(card.cardID == cardId)return card.memo;

        }
        return false;
    }

    //updates all instances of a Card's memo on the page given a card ID and what the memo has been updated to be
    updateMemos(id, memoText){
        let memos = $(`span[id=memo-${id}]`);
        for(const memo of memos){
            if(memoText!=false){
                $(memo).text(`"${memoText}"`);
            }else{
                 $(memo).text("");
            }
        }
    }

    //updates all instances of the save/unsave on the page given a card ID and what the save/unsave text should say
   updateSaves(id, saveText){
      let cards = this.components.filter((component) => component.constructor.name=="Card" && component.card.cardID == id);
      for(const card of cards){
         console.log(card.saveId);
         console.log(saveText);
         $("#"+card.saveId).text(saveText);
      }

   }

    //updates all instances of the little star icon on the page for a given a cardID and wheter or not said card is favorited or not
    updateFavorites(id, favorited){
        for(let component of this.components){
            if(component.constructor.name=="Card" && component.card.cardID==id){
                component.favorited = favorited;
                if(component.favorited){
                    $("#"+component.starId).attr("class", "fa fa-star").show();
                }else{
                   $("#"+component.starId).hide();
                }
            }
        }

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



        let cardViewer = this.getCardViewer();
        if(cardViewer!=false && (page!="/search" && page!="/")){
            cardViewer.view(page);
        }else{
            $("#content").fadeOut(500, () => {
                let pageView = this.getPageMaps()[page];

                //if there is no route avaible for current page, use the '*' route
                if(pageView==undefined) pageView = this.getPageMaps()["*"];


                let pageTitle = pageView.getTitle();
                if(pageTitle!=false)document.title = pageTitle;

                //after page is done rendering, fade it in for style points
                let x = pageView.render().then(()=>{
                    this.currentPage = pageView;
                    $("#content").fadeIn(500);
                });



            });
        }


    }

    //~Unity war flashbacks~
    //this function returns a compnent on the page given the component's class name
    getComponent(type){
        for(const component of this.components){
            if(component.constructor.name == type)return component;
        }
        return false;
    }

    //returns a cardviewer if there's one the page
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

    //returns a JSON where the key corresponds to the slug and the value corrosponds to what view should be rendered
    //the wild card key ("*") is the view that is returned if the slug does not match any of the other keys
    getPageMaps(){
        return {
            "/": (this.user != false) ? new HomeView() : new LoginView(),
            "/search":(this.user != false) ? new SearchView() : new LoginView(),
            "/faq": new FAQView(),
            "/aboutus": new AboutView(),
            "*": new HomeView(this.getUrl())
        }
    }

}
