class CardSurvey extends Survey{

	constructor(){
		super();
	}

	async onCompleted(){
	}

	getPages(){
		return [
			{
				
				question: "Time to build your Passport!",
				color: "#7E57C2",
				answer: "",
				type: "justText",
				data: [{text: "Press Enter to begin building your Passport"}],
				validate: async (answer) => true
			
			},

			{
				
				question: "¯\\_(ツ)_/¯",
				color: "#7E57C2",
				answer: "",
				type: "justText",
				data: [{text: "It's 3am I'm going to sleep"}],
				validate: async (answer) => true
			
			}

		]
	}

}