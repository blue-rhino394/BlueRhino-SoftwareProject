


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
            let savedCardsRequest = {textQuery:"", tags:[], isMyCards: true, pageNumber: 0};
            this.user = postResult;
            console.log(this.user);
        }else{
            console.log(postResult.error);
        }
        this.navigate(this.getUrl(), false);


    }



    hasSaved(cardId) {

        for(const card of this.user.savedCards){

            if(card.cardID == cardId)return true;

        }
        return false;
    }

     getFavorite(cardId) {
        if(this.user==false)return false;
        for(const card of this.user.savedCards){
             //console.log(card.cardID+" vs "+cardId);
            if(card.cardID == cardId)return card.favorited;

        }
        return false;
    }

    getMemo(cardId) {
        if(this.user==false)return false;
        for(const card of this.user.savedCards){
             //console.log(card.cardID+" vs "+cardId);
            if(card.cardID == cardId)return card.memo;

        }
        return false;
    }

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

   updateSaves(id, saveText){
      let cards = this.components.filter((component) => component.constructor.name=="Card" && component.card.cardID == id);
      console.log(cards);
      console.log("DOWN BAD ");
      for(const card of cards){
         console.log(card.saveId);
         console.log(saveText);
         $("#"+card.saveId).text(saveText);
      }

   }


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
    getComponent(type){
        for(const component of this.components){
            if(component.constructor.name == type)return component;
        }
        return false;
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
            "/faq": new FAQView(),
            "/aboutus": new AboutView(),
            "*": new HomeView(this.getUrl())
        }
    }

}
