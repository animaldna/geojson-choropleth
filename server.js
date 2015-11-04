var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('port',process.env.PORT || 8080);

app.listen(app.get('port'),function(){
  console.log("App running on port ", app.get('port'));
});

app.get('/',function(req,res){

  
  res.send("and we're live folks");
});