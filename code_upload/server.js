const http = require('http');
const fs = require('fs');

const con = require("./DBconnection");

const hostname = '127.0.0.1'
const port = '3000'

//const server = http.createServer();

/*server.on("request", (request, response) => {
    if (request.method == 'GET' && request.url == '/') {
        response.statusCode = 200;
        response.setHeader('Content-type', 'text/html');
        fs.createReadStream('./login.html').pipe(response);
    }
  
})*/

const server = http.createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./doctor_profile.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/Password_validation.html') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./Password_validation.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/doctor_profile.html') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./doctor_profile.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/Password_validation_incorrect_pwd.html') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./Password_validation_incorrect_pwd.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/rating.html') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./rating.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/Success.html') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./Success.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/client.js') {

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/js');
        fs.createReadStream('./client.js').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/doctor_profile.js') {

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/js');
        fs.createReadStream('./doctor_profile.js').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/rating.js') {

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/js');
        fs.createReadStream('./rating.js').pipe(res);
    }
    else if (req.method == "POST" && req.url == '/insert') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();
            

            local_con.query('INSERT INTO login_details (email,password) VALUES (?,?)', [obj.user_id, obj.password], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in registration!`);
                }
                else
                    console.log("Registration successful!");
            });

            local_con.end();
            res.end("Registration successful!");
        });

    }
    else if (req.method == "POST" && req.url == '/login') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var content = '';
        req.on('data', function (data) {

            content += data;
            var obj = JSON.parse(content);

            var local_con = con.getConnection();

            local_con.query('SELECT count(*) as success,email FROM login_details where email=? and password=?', [obj.user_id, obj.password], function (error, results1, fields) {
                if (error) {
                    console.log(`Error occured in login!`);
                }
                else {

                    var response_result = JSON.stringify(results1);
                    console.log(response_result);
                    res.end(response_result);
                }

            });
        

            local_con.end();
        });
    }
    else if (req.method == "POST" && req.url == '/submit_review') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();

            console.log(obj.Doc_id);
            console.log(obj.Review);
            console.log(obj.Rating);

            local_con.query('INSERT INTO ratings (doctor_id,review,rating,reviewer_name) VALUES (?,?,?,?)', [obj.Doc_id, obj.Review, obj.Rating,obj.Reviewer_name], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in review submition!`);
                }
                else
                    console.log("Review submitted successful!");
            });

            //res.sendFile("sample_rating.html");
            local_con.end();
            res.end("Review submitted successfully!");
        });

    }
    else if (req.method == "POST" && req.url == '/open_profile') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();

            //console.log(obj.Doc_id);

            local_con.query('select * from doctor_details where doctor_id=?', [obj.Doc_id], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in review submition!`);
                }
                else {
                    var response_result = JSON.stringify(results);
                    //console.log(rows);
                    res.end(response_result);

                    //var toSendRows = {};
                    /*for (i = 0; i < rows.length; i++) {
                        if (rows[i].doctor_photo === null) {
                            docphoto = rows[i].doctor_photo;
                             }
                        else {
                            docphoto = Buffer.from(rows[i].doctor_photo).toString('base64');
                        }
                        var newRow = {
                            First_Name: rows[i].First_Name,
                            Last_Name: rows[i].Last_Name,
                            doctor_photo: docphoto,

                            Phone: rows[i].Phone,
                            Address_1: rows[i].Address_1,
                            City: rows[i].City,
                            State: rows[i].State,
                            Zip: rows[i].Zip,
                            Latitude: rows[i].Latitude,
                            Longitude: rows[i].Longitude
                        };

                        //toSendRows.push(newRow);
                        toSendRows[i] = newRow;
                    }*/
               }
                //console.log(toSendRows);

                //res.write(toSendRows);
                    //console.log(toSendRows);
           });
          
            local_con.end();
           
        });

    }
    else if (req.method == "POST" && req.url == '/display_review') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();

            console.log(obj.Doc_id);

            local_con.query('select * from ratings where doctor_id=? and rating >=3 limit 5', [obj.Doc_id], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in review submition!`);
                }
                else
                    var response_result = JSON.stringify(results);
                res.end(response_result);

                console.log(response_result);

            });
            local_con.end();
            
        });

    }

    else if (req.method == "POST" && req.url == '/average_review') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();

            console.log(obj.Doc_id);

            local_con.query('select avg(rating) as avg_rate from ratings where doctor_id=?', [obj.Doc_id], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in average calculation!`);
                }
                else
                var response_result = JSON.stringify(results);
                res.end(response_result);

                console.log(response_result);

            });

            local_con.end();
        });

    }

    else if (req.method == "POST" && req.url == '/display_review_analysis') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var content = '';
        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            var local_con = con.getConnection();

            console.log(obj.Doc_id);

            local_con.query('select count(*) as input,rating ,doctor_id from ratings where doctor_id=? group by rating order by rating desc;', [obj.Doc_id], function (error, results, fields) {
                if (error) {
                    console.log(`Error occured in average calculation!`);
                }
                else
                    var response_result = JSON.stringify(results);
                res.end(response_result);

                console.log(response_result);

            });

            local_con.end();
       
        });

    }  

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});
