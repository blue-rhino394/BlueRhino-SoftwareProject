


window.onload = function() {
    page = new CPigeon(); 
};


window.onpopstate = function () {
    page.navigate(page.getUrl(), false);
}



class CPigeon {

    constructor() {
        this.user = false;
    //this.pageMap = this.getPageMaps(); 


        this.navigate(this.getUrl(), false);
    }



    navigate(page, pushState=true){
        
        if(pushState)window.history.pushState("", "", page);

        $("#content").fadeOut(500, () => {
            this.getPageMaps()[page].render();
            $("#content").fadeIn(500);
        });

    }



    getUrl(){
        return window.location.pathname;
    }

    getPageMaps(){
        return {
            "/": (this.user != false) ? new HomeView() : new LoginView(),
        }
    }

}