const http = require('http');
const fs = require('fs');

const con = require("./DBconnection");

const hostname = '127.0.0.1'
const port = '3000'

const server = http.createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./Password_validation.html').pipe(res);
    }
    else if (req.method == 'GET' && req.url == '/client.js') {

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/js');
        fs.createReadStream('./client.js').pipe(res);
    }
    else if (req.method == "POST" && req.url == '/insert') {
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

    }
    else if (req.method == "POST" && req.url == '/login') {
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

    }
    else if (req.method == "POST" && req.url == '/submit_review') {
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

    }
 /*   else if (req.method == "GET" && req.url =='/addTable')
    {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
       
        var local_con = con.getConnection();

        local_con.query('SELECT * FROM health_camp', function (error, results, fields) {
            if (error) {
                console.log(`Error occured in select table!`);
            }

            var response_result = JSON.stringify(results);
            res.end(response_result);

            results.forEach((record) => {
                console.log(record);
            });

         });
        local_con.end();
        
    }*/    

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});
