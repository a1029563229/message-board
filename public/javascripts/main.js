var	main = new Vue({
	el:'#main',

	data:{
		docs:''
	},

	methods:{
		update:function () {
			console.log('is');
			$.post('/up', main.docs, function (json) {
				console.log(json);
			});
		}
	}
})
