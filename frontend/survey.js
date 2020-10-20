class Survey {

	constructor(){
		this.pages = this.getPages();
	}


	getPages(){
		return [
			{
				question: "First name",
				answer: "",
				validate: (answer) => {
					if(answer.length < 3){
						return "Your first name must be at least 3 characters!";
					}
					return true;
				}
			},

			{
				question: "Last name",
				answer: "",
				validate: (answer) => {
					if(answer.length < 3){
						return "Your last name must be at least 3 characters!";
					}
					return true;
				}
			}


		]
	}

}