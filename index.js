var _ = require('underscore');
var async = require('async');
var request = require('request');

function condenseData(body, callback){
	var rawJSON = JSON.parse(body);
	var countyData = [];
	for(var i=0; i < rawJSON.length; i++){
		currentCounty = rawJSON[i].county;
		if(countyData.hasOwnProperty(currentCounty)){
			//console.log(countyData);
			countyData[currentCounty].push(rawJSON[i].up_to_date_2);

			countyData[]
		} else {
			countyData.push({currentCounty: [[rawJSON[i].up_to_date_2]});
		}
	}
	console.log(countyData);
	callback(countyData);
}

function calcAvgs(countyData){
	var countyAvgs = {};
	_.each(countyData,function(county){
		console.log(county);
		/*var sum = county.values.reduce(function(prev,current){
      		return prev + current;
    	});*/

    	
	});
 	//console.log(JSON.stringify(countyAvgs));
}

request('https://cdph.data.ca.gov/resource/v5bp-qkhg.json?$select=county,up_to_date_2&$where=reported=%27Y%27',function(err,res,body){
 if(!err && res.statusCode == 200){
 	//console.log(body);
 	condenseData(body,calcAvgs);
 }
});

