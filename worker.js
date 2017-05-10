var Gearman = require("node-gearman"),
    gearman = new Gearman();  // defaults to localhost

gearman.registerWorker("explotion", function(payload, worker){
	console.log(payload);
	if(!payload){
		worker.error();
		return;
	}
	
	var args = payload.toString();
	
	// delay for 1 sec before returning
	setTimeout(function(){
		console.log("sending ");
		console.log(args);
		worker.end(args);
	},20);
	
});
