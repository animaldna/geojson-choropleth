var _ = require('underscore');
var async = require('async');
var request = require('request');

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

var setRanges = function(countyAvgs, callback){
	var allVals = [];
	_.each(countyAvgs,function(val){
		allVals.push(parseInt(val,10));
	});
	var min = _.min(allVals);
	var max = _.max(allVals);
	var itemsInRange = (max - min) + 1;
	callback(null);
}


async.waterfall([
	getData,
	condenseData,
	calcAvgs,
	setRanges
],function(err, result){
	//
});