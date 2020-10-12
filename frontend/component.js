class Component {

	render(location){
		$("#"+location).html(this.getContent());
	}

	getContent(){}

}

class TestComponent extends Component{

	constructor(num){
		super();
		this.num = num;
	}

	click(){
		page.navigate("/next");
	}

	getContent(){
		return $("<div/>")
				.html(`This is my test component #${this.num}`)
            	.attr("id","homeView")
            	.append($("<br>"))
            	.append($('<button/>', {
					text: 'Test',
				    click: this.click
				}));
	}

}

