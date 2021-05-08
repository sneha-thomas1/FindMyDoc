var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
//Import mySQL module
const mysql = require('mysql');
 app = express();
var bodyParser = require('body-parser');

var fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
//var jsonParser = bodyParser.json()
app.use(bodyParser.json());
// First you need to create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'findmydoctor'
});

app.use('/static',express.static(__dirname + "/public"))

// Create a server
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/htmlfiles/client.html");
    //res.sendFile(__dirname + "/mapdistance.html");
});
app.get('/symptoms_checker', function (req, res) {
    res.sendFile(__dirname + "/public/htmlfiles/symptoms_checker.html");
    //res.sendFile(__dirname + "/mapdistance.html");
});

var Promise = require('bluebird');
var queryAsync = Promise.promisify(db.query.bind(db));
db.connect();

// do something when app is closing
// see http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.stdin.resume()
process.on('exit', exitHandler.bind(null, { shutdownDb: true } ));

app.use(bodyParser.urlencoded({ extended: true }));

/*app.set('views', __dirname+'/public/htmlfiles');
//app.engine('html', require('ejs').renderFile);
app.set("view options", {layout: false});
app.set('view engine', 'ejs');

//app.set("view engine", "pug");
//app.set("views", path.join(__dirname, "/public/htmlfiles"));


/*router.get("/about", (req, res) => {
  res.render("about", { title: "Hey", message: "Hello there!" });
});*/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/public/htmlfiles');






app.post('/getdoctordetails', function (req, res) {
  var numRows;
  var queryPagination;
  var numPerPage = 5;
  var page = parseInt(req.query.page, 10) || 0;
  var numPages;
  var skip = (page-1) * numPerPage;
  // Here we compute the LIMIT parameter for MySQL query
  var limit = skip + ',' + numPerPage;
  var speciality =  req.body.speciality;
    var gender =  req.body.gender;
    var docname =  req.body.docname;
    var zipcode =  req.body.zipcode;
    const params = [];
    doctorsql ='select doctor_id,`First Name` as firstname,`Middle Name` as middlename,`Last Name` as lastname,`Address 1` as address1,`Address 2` as address2,city,county,state,zip,latitude,longitude from doctor_details where 1 = 1';
    ratingsql ='select avg(rating) as rating,count(rating_id) as reviewcount,doctor_id from ratings where 1 = 1';
    if (gender !== 'All') {
        doctorsql += ' and Gender = ?';
        console.log(gender.substring(0,1));
        params.push(gender.substring(0,1));
      }
    if (zipcode !== '') {
        doctorsql += ' and zip = ?';
        params.push(zipcode);
      }
    if (docname !== '') {
      var namearray=docname.split(/(\s+)/).filter( e => e.length > 1);
      var firstname;
      var lastname;
      var middlename;
      console.log(namearray);
      if (namearray.length==3){
      firstname=namearray[0];
      lastname=namearray[2];
      middlename=namearray[1];
    }
    else if (namearray.length==2){
      firstname=namearray[0];
      lastname=namearray[1];
      middlename=namearray[1];
    }
    else if(namearray.length==1){
      firstname=namearray[0];
      lastname=namearray[0];
      middlename=namearray[0];
    }
    console.log(firstname); console.log(lastname);console.log(middlename);
     //doctorsql += " and (`First Name` Like '%" + docname + "%' or `Middle Name` like '%" + docname + "%' or `Last Name` Like '%" + docname + "%')";
      doctorsql += " and (`First Name` Like '%" + firstname + "%' or `Middle Name` like '%" + middlename + "%' or `Last Name` Like '%" + lastname + "%')";

      }
      if (speciality !== 'All') {
        ratingsql += ' and speciality = ?';
        doctorsql += ' and `Sub Specialty` = ?';
        params.push(speciality);
        params.push(speciality);
      }
    var countquery='select count(*) as numRows from ('+doctorsql+') as dd left join ('+ratingsql+' group by doctor_id)as r on r.doctor_id=dd.doctor_id';
    var sqlquery='select dd.doctor_id,r.reviewcount,round(r.rating,1) as rating,dd.firstname,dd.middlename,dd.lastname,dd.address1,dd.address2,dd.city,dd.county,dd.state,dd.zip,dd.longitude,dd.latitude from ('+doctorsql+') as dd left join ('+ratingsql+' group by doctor_id)as r on r.doctor_id=dd.doctor_id order by rating desc LIMIT '+limit;
    console.log(sqlquery);
    var query=db.query(countquery,params,function(err,rows){
    //console.log(query);
    if(err){
        throw err;
    }
        else{
          numRows = rows[0].numRows;
    numPages = Math.ceil(numRows / numPerPage);
    console.log('number of pages:', numPages);
    var query1=db.query(sqlquery,params,function(err,rows){
    //console.log(query);
    if(err){
        throw err;
    }
        else{
    var toSendRows={};
        for (i = 0; i<rows.length; i++)
        {
          docname="";
          docname+=rows[i].firstname+" ";
          if(rows[i].middlename !==''){
            docname+=rows[i].middlename+' ';}
          docname+=rows[i].lastname;
          docplace=rows[i].county+","+rows[i].state;
          address=rows[i].address1+","+rows[i].address2;

          var newRow = {
                    doctor_id :rows[i].doctor_id,
                    docname : docname,
                    docplace  : docplace,
                    rating  : rows[i].rating,
                    reviewcount  : rows[i].reviewcount,
                    address :address,
                    city :rows[i].city,
                    zip   :rows[i].zip,
                    latitude :rows[i].latitude,
                    longitude :rows[i].longitude
                  };
                  //toSendRows.push(newRow);
                  toSendRows[i]=newRow;
               }
                  if (page <= numPages) {
      toSendRows.pagination = {
        totalrows:numRows,
        current: page,
        perPage: numPerPage,
        previous: page > 0 ? page - 1 : undefined,
        next: page < numPages - 1 ? page + 1 : undefined
      }
    }
    else {
      toSendRows.pagination = {
      err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
    }
  }
                 console.log(toSendRows);
                 res.json(toSendRows);
              }
            })
  }
})
  })

  

 

function exitHandler(options, err) {
  if (options.shutdownDb) {
    console.log('shutdown mysql connection');
    connection.end();
  }
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}



//get bestdoctordetails
app.post('/bestDoctors',function(req,res){
    const speciality =  req.body.speciality;
    console.log("speciality :::: " + speciality);
    var query=db.query("SELECT dd.doctor_id,dd.docname,dd.placename,dd.latitude,dd.longitude,round(r.rating,1) as rating,r.reviewcount FROM (select avg(rating) as rating,count(rating_id) as reviewcount,doctor_id from ratings where speciality=? group by doctor_id order by rating desc LIMIT 5) as r join (select doctor_id,CONCAT_WS('',`First Name`,' ',`Middle Name`,' ',`Last Name`) as docname,CONCAT_WS('',County,',',State) as placename,latitude,longitude from doctor_details where `Sub Specialty`=?) as dd on r.doctor_id=dd.doctor_id ;",[speciality,speciality],function(err,rows){
    if(err){
        throw err;
    }
        else{
        console.log(rows);
        res.send(rows);
              }
})
})

app.get('/doctorspeciality',function(req,res){
    db.query('SELECT distinct `Sub Specialty` as speciality FROM doctor_details',function(err,rows){
    if(err){
        throw err;
    }
        else{
        console.log(rows);
        res.send(rows);
              }
   })
  })
var sessionID = '78jkFnICKToE1G8m';
var baseURL = 'https://api.endlessmedical.com/v1/dx';

app.get('/symptoms_output',function(req,res){
  console.log("post api");
  var initSessionURL = baseURL+'/InitSession';
  var termsURL = baseURL + '/AcceptTermsOfUse?SessionID='+sessionID+'&passphrase=I%20have%20read,%20understood%20and%20I%20accept%20and%20agree%20to%20comply%20with%20the%20Terms%20of%20Use%20of%20EndlessMedicalAPI%20and%20Endless%20Medical%20services.%20The%20Terms%20of%20Use%20are%20available%20on%20endlessmedical.com';
  let rawdata = fs.readFileSync('SymptomsOutput.json');
  let symptoms_list = JSON.parse(rawdata);
  res.send(symptoms_list);
  /*
  request.get(initSessionURL, {json: true}, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        console.log(res.body.SessionID);
        sessionID = res.body.SessionID;
        request.post(termsURL, {json: true}, function(err, res, body) {
          if (!err && res.statusCode === 200) {
            console.log("Accepted terms and conditions");
          }
        });
      }
    });*/

  })

function updateFeature(urls, idx) {
  request.post(urls[idx], {json: true}, function(err, res, body) {
      if (!err && res.statusCode === 200) {
          console.log("sent feature: "+urls[idx]);
          if(idx+1 < urls.length)
            updateFeature(urls, idx+1);
      }
    });
}

app.post('/update_symptoms',function(req,res){
  console.log(req.body);
  var featureURLs = [];
  for (var key in req.body) {
    var featureURL = baseURL + '/UpdateFeature?SessionID='+sessionID+'&name='+key+'&value='+req.body[key];
    featureURLs.push(featureURL);
  }
  updateFeature(featureURLs, 0);
})

app.get('/analyze_symptoms',function(reqMain,resMain){
  var analyzeURL = baseURL + '/Analyze?SessionID='+sessionID+'&NumberOfResults=10';
  console.log(analyzeURL);
  request.get(analyzeURL, {json: true}, function(err, res, body) {
    if (!err && res.statusCode === 200) {
        //console.log("Analysis: "+JSON.stringify(res.body.Diseases));
        resMain.send(JSON.stringify(res.body.Diseases));
    }
  });
})


//rasika
app.get('/',function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./Password_validation.html').pipe(res);
    })
  app.get('/client.js',function(req,res){

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/js');
        fs.createReadStream('./client.js').pipe(res);
    })
    app.post('/insert',function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();
            

            local_con.query('INSERT INTO login_details (email,password) VALUES (?,MD5(?))', [obj.user_id, obj.password], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in registration!`);
                }
                else
                    console.log("Registration successful!");
            });

            local_con.end();
            res.end("Registration successful!");
        });

    })
    app.post('/login',function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function (data) {

            content += data;
            var obj = JSON.parse(content);

            var local_con = con.getConnection();
            var row_count;

            local_con.query('SELECT * FROM login_details where email=? and password=?', [obj.user_id, obj.password], function (error, results1, fields) {
                if (error) {
                    console.log(`Error occured in login!`);
                }
                else {
                        row_count = results1.length;
                        if (row_count = 1)
                            res.end('yes');
                        else
                            res.no('no');
                         console.log('user logged in: ' + obj.user_id);

                }
            });

            local_con.end();
              //res.end("Record updated successfully");
        });

    })
    app.post('/submit_review',function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();


            local_con.query('INSERT INTO ratings (email,password) VALUES (?,MD5(?))', [obj.Doc_id, obj.password], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in registration!`);
                }
                else
                    console.log("Registration successful!");
            });

            local_con.end();
            res.end("Registration successful!");
        });
})













app.listen(3000);
//app.listen(8080, '127.0.0.1')
