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
//CLEARDB_DATABASE_URL: mysql://b3e5380a3e4879:6681aeee@us-cdbr-east-03.cleardb.com/heroku_e6b5955ec516405?reconnect=true
//mysql --host=us-cdbr-east-03.cleardb.com --user=b3e5380a3e4879 --password=6681aeee --reconnect heroku_e6b5955ec516405
/*const db = mysql.createPool({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b3e5380a3e4879',
  password: '6681aeee',
  database: 'heroku_e6b5955ec516405'
});*/

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'findmydoctor'
});

app.use('/static',express.static(__dirname + "/public"))
app.use('/css',express.static(__dirname + "/public/css"))
app.use('/js',express.static(__dirname + "/public/js"))
app.use('/images',express.static(__dirname + "/public/images"))
app.use('/fonts',express.static(__dirname + "/public/fonts"))
app.use('/assets',express.static(__dirname + "/public/assets"))

// Create a server
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
    //res.sendFile(__dirname + "/mapdistance.html");
});
app.get('/old_index', function (req, res) {
    res.sendFile(__dirname + "/public/client.html");
    //res.sendFile(__dirname + "/mapdistance.html");
});
app.get('/symptoms_checker', function (req, res) {
    res.sendFile(__dirname + "/public/symptoms_checker.html");
    //res.sendFile(__dirname + "/mapdistance.html");
});
app.get('/symptoms_checker_new', function (req, res) {
    res.sendFile(__dirname + "/public/wizard-list-boat-BKP.html");
});
app.get('/header.html', function (req, res) {
    res.sendFile(__dirname + "/public/header.html");
});
app.get('/footer.html', function (req, res) {
    res.sendFile(__dirname + "/public/footer.html");
});
app.get('/doctor_search_box.html', function (req, res) {
    res.sendFile(__dirname + "/public/doctor_search_box.html");
});
app.get('/search_doctors', function (req, res) {
    res.sendFile(__dirname + "/public/search_doctors.html");
});

app.get('/doctor_profile', function (req, res) {
    res.sendFile(__dirname + "/public/doctor_profile.html");
});
app.get('/Password_validation', function (req, res) {
    res.sendFile(__dirname + "/public/Password_validation.html");
});

//var Promise = require('bluebird');
//var queryAsync = Promise.promisify(db.query.bind(db));
//db.connect();

// do something when app is closing
// see http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
//process.stdin.resume()
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
    doctorsql ='select doctor_id,doctor_photo,`First_Name` as firstname,`Middle_Name` as middlename,`Last_Name` as lastname,`Address_1` as address1,`Address_2` as address2,city,county,state,zip,latitude,longitude from doctor_details where 1 = 1';
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
      var namearray=docname.split(/(\s+)/).filter( e => e.length >= 1);
      namearray=namearray.filter(function(entry) { return entry.trim() != ''; });
      var firstname;
      var lastname;
      var middlename;
      console.log(namearray);
      if (namearray.length==3){
      firstname=namearray[0];
      lastname=namearray[2];
      middlename=namearray[1];
      doctorsql += " and (`First_Name` Like '%" + firstname + "%' and `Middle_Name` like '%" + middlename + "%' and `Last_Name` Like '%" + lastname + "%')";

    }
    else if (namearray.length==2){
      firstname=namearray[0];
      lastname=namearray[1];
      middlename=namearray[1];
      doctorsql += " and `First_Name` Like '%" + firstname + "%' and ( `Middle_Name` like '%" + middlename + "%' or `Last_Name` Like '%" + lastname + "%')";

    }
    else if(namearray.length==1){
      firstname=namearray[0];
      lastname=namearray[0];
      middlename=namearray[0];
      doctorsql += " and (`First_Name` Like '%" + firstname + "%' or `Middle_Name` like '%" + middlename + "%' or `Last_Name` Like '%" + lastname + "%')";

    }
    console.log(firstname); console.log(lastname);console.log(middlename);
     //doctorsql += " and (`First Name` Like '%" + docname + "%' or `Middle Name` like '%" + docname + "%' or `Last Name` Like '%" + docname + "%')";
      //doctorsql += " and (`First_Name` Like '%" + firstname + "%' or `Middle_Name` like '%" + middlename + "%' or `Last_Name` Like '%" + lastname + "%')";

      }
      if (speciality !== 'All') {
        //ratingsql += ' and speciality = ?';
        doctorsql += ' and `Sub_Specialty` = ?';
        params.push(speciality);
        //params.push(speciality);
      }
    var countquery='select count(*) as numRows from ('+doctorsql+') as dd left join ('+ratingsql+' group by doctor_id)as r on r.doctor_id=dd.doctor_id';
    var sqlquery='select dd.doctor_id,dd.doctor_photo,r.reviewcount,round(r.rating,1) as rating,dd.firstname,dd.middlename,dd.lastname,dd.address1,dd.address2,dd.city,dd.county,dd.state,dd.zip,dd.longitude,dd.latitude from ('+doctorsql+') as dd left join ('+ratingsql+' group by doctor_id)as r on r.doctor_id=dd.doctor_id order by rating desc LIMIT '+limit;
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
if (rows[i].doctor_photo===null){
            docphoto=rows[i].doctor_photo;
          }
        else{
          
          docphoto=Buffer.from(rows[i].doctor_photo).toString('base64');

          //console.log('<img src="data:image/jpeg;base64,'+Buffer.from(docphoto).toString('base64')+'"/>');
          //console.log('<img src="data:image/jpeg;base64,'+docphoto+'"/>');
          //.toString();
        }
          var newRow = {
                    doctor_id :rows[i].doctor_id,
                    doctor_photo :docphoto,
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
    var query=db.query("SELECT dd.doctor_id,dd.doctor_photo,dd.docname,dd.placename,dd.latitude,dd.longitude,round(r.rating,1) as rating,r.reviewcount FROM (select avg(rating) as rating,count(rating_id) as reviewcount,doctor_id from ratings group by doctor_id order by rating desc LIMIT 5) as r join (select doctor_id,doctor_photo,CONCAT_WS('',`First_Name`,' ',`Middle_Name`,' ',`Last_Name`) as docname,CONCAT_WS('',County,',',State) as placename,latitude,longitude,phone from doctor_details where `Sub_Specialty`=?) as dd on r.doctor_id=dd.doctor_id ;",[speciality],function(err,rows){
    if(err){
        throw err;
    }
        else{
        //console.log(rows);
        var toSendRows={};
        for (i = 0; i<rows.length; i++)
        {
          if (rows[i].doctor_photo===null){
            docphoto=rows[i].doctor_photo;
          }
        else{
          docphoto=Buffer.from(rows[i].doctor_photo).toString('base64');
        }
          var newRow = {
                    doctor_id :rows[i].doctor_id,
                    doctor_photo :docphoto,
                    docname : rows[i].docname,
                    placename  : rows[i].placename,
                    rating  : rows[i].rating,
                    reviewcount  : rows[i].reviewcount,
                    latitude :rows[i].latitude,
                    longitude :rows[i].longitude
                  };
                  //toSendRows.push(newRow);
                  toSendRows[i]=newRow;
                }
                console.log(toSendRows);
        res.send(toSendRows);
              }
})
})


app.get('/doctorspeciality',function(req,res){
    db.query('SELECT distinct `Sub_Specialty` as speciality FROM doctor_details',function(err,rows){
    if(err){
        throw err;
    }
        else{
        console.log(rows);
        res.send(rows);
              }
   })
  })
var sessionID = 'peqEuYBeagkQy0dH';
var baseURL = 'https://api.endlessmedical.com/v1/dx';

app.get('/symptoms_output',function(req,res){
  console.log("post api");
  var initSessionURL = baseURL+'/InitSession';
  let rawdata = fs.readFileSync('SymptomsOutput.json');
  let symptoms_list = JSON.parse(rawdata);
  res.send(symptoms_list);
  request.get(initSessionURL, {json: true}, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        console.log("Session Id: "+res.body.SessionID);
        sessionID = res.body.SessionID;
        var termsURL = baseURL + '/AcceptTermsOfUse?SessionID='+sessionID+'&passphrase=I%20have%20read,%20understood%20and%20I%20accept%20and%20agree%20to%20comply%20with%20the%20Terms%20of%20Use%20of%20EndlessMedicalAPI%20and%20Endless%20Medical%20services.%20The%20Terms%20of%20Use%20are%20available%20on%20endlessmedical.com';
        request.post(termsURL, {json: true}, function(err, res, body) {
          if (!err && res.statusCode === 200) {
            console.log("Accepted terms and conditions");
          }
        });
      }
    }); 

  })

function updateFeature(urls, idx) {
  request.post(urls[idx], {json: true}, function(err, res, body) {
      if (!err && res.statusCode === 200) {
          console.log("sent feature: "+urls[idx]);
          if(idx+1 < urls.length)
            updateFeature(urls, idx+1);
      }
      else
        console.log("error while sending feature:"+urls[idx]);
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
        console.log("Analysis: "+JSON.stringify(res.body.Diseases));
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

//app.listen(3000);
//app.listen(8080, '127.0.0.1')
app.post('/languageFile',function(req,res){
  language=req.body.language;
  res.statusCode = 200;
  res.setHeader('Content-type', 'text/xml');
  if (language=="Spanish")
  {
  fs.createReadStream(__dirname + "/public/res/Strings/string_Spanish.xml").pipe(res);
  }
  else {
    fs.createReadStream(__dirname + "/public/res/Strings/string.xml").pipe(res);
  }
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
