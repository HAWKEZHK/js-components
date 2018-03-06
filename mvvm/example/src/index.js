import MVVM from './../../src/mvvm'

const vm = new MVVM({
	el: '#vue-app',
	data: {
		word: 'Hello World!'
	},
	methods: {
		sayHi() {
			this.word = 'Hi, everybody!';
			alert(1)
		}
	}
});