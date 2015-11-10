var _ = require('underscore');
var async = require('async');
var request = require('request');

//choropleth colors, in order from light -> dark
var colors = ['#f2f0f7','#cbc9e2','#9e9ac8','#756bb1','#54278f'];

function setColors(value){
	if(value <= 50){
		return "#C9C9C9";
	} else if (value < 61){
		return "#f2f0f7";
	} else if (value > 60 && value < 71){
		return "#cbc9e2";
	} else if (value > 70 && value < 81){
		return "#9e9ac8";
	} else if (value > 80 && value < 91){
		return "#756bb1";
	} else {
		return "#54278f";
	}
}


function sortNumber(a,b) {
    return a - b;
}

var getData = function(callback){
	request('https://cdph.data.ca.gov/resource/v5bp-qkhg.json?$limit=50000&$select=county,up_to_date_2&$where=reported=%27Y%27',function(err,res,body){
	 	if(!err && res.statusCode == 200){
		 	callback(null,body);
		 }
	});
}

var condenseData = function(body, callback){
	var rawJSON = JSON.parse(body);
	var countyData = {};
	for(var i=0; i < rawJSON.length; i++){
		currentCounty = rawJSON[i].county;
		if(countyData.hasOwnProperty(currentCounty)){
			countyData[currentCounty].push(parseInt(rawJSON[i].up_to_date_2, 10));
		} else {
			countyData[currentCounty] = [parseInt(rawJSON[i].up_to_date_2,10)];
		}
	}
	//console.log(JSON.stringify(countyData));
	callback(null,countyData);
}

var calcAvgs = function (countyData, callback){
	var countyAvgs = {};
	var sum;
	var avg;
	_.each(countyData,function(value,key){
		sum = _.reduce(value,function(memo,num){
			return memo + num;
		}, 0);

		avg = sum / (value.length);
		avg = avg.toFixed(2);

		countyAvgs[key] = avg;
	});
	//console.log('countyAvgs is', countyAvgs);
	callback(null,countyAvgs);
}

var generateJSON = function(countyAvgs, callback){
	
}

/*var setRanges = function(countyAvgs, callback){
	var allVals = [];
	_.each(countyAvgs,function(val){
		allVals.push(parseInt(val,10));
	});
	var min = Math.round((_.min(allVals)/10) * 10); 
	var itemsInRange = (100 - min) + 1;

	if(itemsInRange % 5 === 0){
		console.log('even split');
	}

	var setColors = function(colors,range){

	}

	callback(null);
}*/



async.waterfall([
	getData,
	condenseData,
	calcAvgs,
	setRanges
],function(err, result){
	//
});