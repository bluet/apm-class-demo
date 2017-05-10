
var Gearman = require("node-gearman"),
    gearman = new Gearman(); // defaults to localhost

var depth = 6;


function split (depth_in) {
	var arr = [];
	arr[0] = dispatch(depth_in - 1);
	arr[1] = dispatch(depth_in - 1);
		
	var pp = Promise.all(arr).then(function () {
			return Promise.resolve(depth_in)
		});
		
	return pp;
}

function dispatch (depth_in) {
	return new Promise(function(resolve, reject) {
		var job = gearman.submitJob("explotion", depth_in);
		//~ job.setTimeout(2000);
		
		job.on("timeout", function(){
			console.log("Timeout!");
			//~ gearman.close();
			return reject("timeout");
		})
		
		job.on("error", function(err){
			console.log("ERROR: ", err.message || err);
			//~ gearman.close();
			return reject(err);
		});
		
		job.on("data", function(args){
			var local_depth = args.toString();
			if (local_depth <= 1) {
				return resolve(local_depth);
			} else {
				split(local_depth).then(function(){resolve(local_depth)});
			}
		});
		
		job.on("end", function(){
			//~ console.log("Ready!");
			//~ gearman.close();
			//~ return resolve('end');
		});
	}).catch(function (err) {console.log(err)});
	
	
}

var compute = split(depth);
compute.then( function(successMessage) {
	console.log("Yay! " + successMessage);
	gearman.close();
}).catch(function (err) {console.log(err)});
