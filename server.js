var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('port',process.env.PORT || 8080);
app.use(express.static(__dirname + '../public'));


app.listen(app.get('port'),function(){
  console.log("App running on port ", app.get('port'));
});

app.get('/',function(req,res){
  res.render('index');
});