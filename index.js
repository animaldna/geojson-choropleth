var _ = require('underscore');
var async = require('async');
var request = require('request');
var fs = require('fs');

function setColor(value){
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

var getData = function(callback){
	var url = 'https://cdph.data.ca.gov/resource/v5bp-qkhg.json?$limit=50000&$select=county,up_to_date_2&$where=reported=%27Y%27';
	request(url,function(err,res,body){
	 	if(!err && res.statusCode == 200){
		 	callback(null,body);
		 }
	});
}

var condenseData = function(body, callback){
	var rawJSON = JSON.parse(body);
	var countyData = {};
	var currentCounty;
	for(var i=0; i < rawJSON.length; i++){
		currentCounty = rawJSON[i].county;
		if(countyData.hasOwnProperty(currentCounty)){
			countyData[currentCounty].push(parseInt(rawJSON[i].up_to_date_2, 10));
		} else {
			countyData[currentCounty] = [parseInt(rawJSON[i].up_to_date_2,10)];
		}
	}

	callback(null,countyData);
}

var calcAvgs = function (countyData, callback){
	var countyAvgs = [];
	var sum;
	var avg;
	_.each(countyData,function(value,key){
		sum = _.reduce(value,function(memo,num){
			return memo + num;
		}, 0);

		avg = sum / (value.length);
		avg = Math.round( avg * 1e2 ) / 1e2;

		countyAvgs.push(avg);
	});

	callback(null,countyAvgs);
}

var stripSortGeo = function(countyAvgs, callback){
	var geoJSON = {};
	fs.readFile('public/calif_geo.json',function(err,data){
		if(err){
			console.log(err);
		}
		geoJSON = JSON.parse(data);
		geoJSON = geoJSON.features;
		
		var newGeo = _.sortBy(geoJSON, function(feature){
			return feature.properties.name;
		});
		callback(null, countyAvgs, newGeo);
	});
}

var generateJSON = function(countyAvgs, newGeo, callback){
	var zingmapJSON = {};
	var average;
	var id;
	var color;
	var name;
	
	_.each(newGeo, function(value, key){
		id = value.id;
		id = id.replace(/\./g,'_'); //replace . with _ for ZC compatibility
		name = value.properties.name;
		average = countyAvgs[key]; //we sorted the features array (newGeo) so we could use this key
		
		zingmapJSON[id] = {
			"backgroundColor": setColor(average),
			"hover-state":{
				"border-color":"#e0e0e0",
				"border-width":2,
				"background-color": setColor(average)
			},
			"tooltip":{
				"text": name + " County <br>" + average + "%"
			}
		}
	});
	fs.writeFile('./zingMap.json', JSON.stringify(zingmapJSON));
	callback(null,zingmapJSON);
}

async.waterfall([
	getData,
	condenseData,
	calcAvgs,
	stripSortGeo,
	generateJSON
],function(err, result){
	console.log('\n good job! check out your JSON!');
});