var	main = new Vue({
		el:'#main',

		data:{
			docs:''
		},

		methods:{
			update:function () {
				$.post('localhost:3000/up', main.docs, function (json) {
					console.log(json);
				});
			}
		}
	})
};
