//sort out functions to sort unique entries within an array, used in filter func
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

//take in parameter if pushing or delete
function pushOrDelete(action){
	var keyword = document.getElementById("keyword").value;
	    //create array to store tab URL and tab titles
		var urlID = new Array();
		var titleID = new Array();
		//get tabs in current window and store url IDs
		chrome.tabs.query({currentWindow:true}, function(tabs){
			for(i = 0; i < tabs.length; i++){
				if(tabs[i].url.toLowerCase().indexOf(keyword) >= 0){
					urlID.push(tabs[i].id);
				}
			}
			//get tabs in the current window and store tab IDs
			chrome.tabs.query({currentWindow:true}, function(tabs){
				for(i = 0; i < tabs.length; i++){
					if(tabs[i].title.toLowerCase().indexOf(keyword) >= 0){
						titleID.push(tabs[i].id);
					}	
				}
				var finalStr = urlID.concat(titleID);
				//use filter function to filter out repeated 
				finalStr = finalStr.filter(onlyUnique);
				for (i = 0; i < finalStr.length; i++){
					if(action == "push"){
						//move the tab if action is push
						chrome.tabs.move(finalStr[i],{index:0});
						if (i == finalStr.length - 1){
							console.log("check");
							chrome.tabs.update(finalStr[i],{highlighted:true});
						}
					}
					//remove the tab if the action is not push
					else{
						chrome.tabs.remove(finalStr[i],function(){});
					}
				}
			});
			//chrome.tabs.update(tabs[0].id, {highlighted:true});
		});
}

//listen to button press
document.addEventListener('DOMContentLoaded',function(){
	document.getElementById("retrieve").addEventListener('click', function(){
		if(document.getElementById("keyword").value != ""){
			pushOrDelete("push");
			document.getElementById("keyword").value = "";
		}
	});
	document.getElementById("delete").addEventListener('click', function(){
		if(document.getElementById("keyword").value != ""){
			pushOrDelete();	
			document.getElementById("keyword").value = "";
		}
	})
});