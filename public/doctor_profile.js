//sessionStorage.setItem("doctor_id", "101");

window.onload = page_load();


function initMap() { }// now it IS a function and it is in global

    initMap = function () {
        // your code like...

        var map = new google.maps.Map(document.getElementById('map'), {/*your code*/ });
        // and other stuff...
    }

function page_load() {
    open_profile();
    average_review();
    display_review_analysis();
    display_review();   
}

function check_login() {

    var found = sessionStorage.getItem("found");
    if (found == null) {
        window.location.href = 'login.html';
    }
    else {
        window.location.href = 'rating.html';

    }

}

function open_profile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            //var doctor_detail = JSON.parse(this.responseText);
            //console.log(doctor_detail);

            var element = document.getElementById("photo_display");

            //doctor_detail.forEach((row) => {

var response=JSON.parse(this.responseText);
responselength=Object.keys(response).length;
          for(let index = 0; index < responselength; index++) {
            row=response[index];
                document.getElementById("Name").innerHTML = 'Dr. ' + row.First_Name + ' ' + row.Last_Name;
                document.getElementById("phone_no").innerHTML = 'Contact : ' +row.Phone;
                document.getElementById("address").innerHTML = 'Address : '+ row.Address_1 + ', ' + row.City + ', ' + row.State + ', ' + row.Zip;
                document.getElementById("description").innerHTML = row.description;

                document.getElementById("doctorphoto").src = "data:image/png;base64,"+row.doctor_photo;

                // Get the location of the doctor
                const doc_loc = { lat: row.Latitude, lng: row.Longitude };

                // The map, centered at doctor location

                const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 4,
                    center: doc_loc,
                });
                // The marker, positioned at doctor location

                const marker = new google.maps.Marker({
                    position: doc_loc,
                    map: map,
                });

            }
        }
    }
    var doc_id = sessionStorage.getItem("doctor_id");

    //console.log(doc_id);

    xhttp.open("POST", "/open_profile", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"Doc_id":"' + doc_id + '"}');
 
}

function display_review() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var doctor_review = JSON.parse(this.responseText);
            //console.log(doctor_review);


            doctor_review.forEach((row) => {            

                var element = document.getElementById("review_display");

                if (row.rating == 1) {

                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                }
                else if (row.rating == 2) {
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                }
                else if (row.rating == 3) {
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                }
                else if (row.rating == 4) {
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-o");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                }
                else if (row.rating == 5) {
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:25px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                }
                //var para = document.createElement("p");
                //var node = document.createTextNode(row.rating); //+ "\n" + row.reviewer_name + "\n" + row.review);
                //para.appendChild(node);
                //element.appendChild(para);

                var para = document.createElement("p");
                var node = document.createTextNode(row.reviewer_name); //+ "\n" + row.reviewer_name + "\n" + row.review);
                para.appendChild(node);
                element.appendChild(para);            

                var para = document.createElement("p");
                var node = document.createTextNode(row.review); //+ "\n" + row.reviewer_name + "\n" + row.review);
                para.appendChild(node);
                element.appendChild(para);

                var br = document.createElement("br");
                element.appendChild(br);
              
                });

           

        }
    }
    var doc_id = sessionStorage.getItem("doctor_id");

    //console.log(doc_id);

    xhttp.open("POST", "/display_review", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"Doc_id":"' + doc_id + '"}');

}


function average_review() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {


            var result = this.responseText;
            var avg_star = JSON.parse(result);
            console.log(avg_star);

            avg_star.forEach((row) => {
                document.getElementById("avg_review").innerHTML = 'Average (' + (Math.round(row.avg_rate * 10)/10) +')';//avg_star.avg_rate;

                var element = document.getElementById("avg");
                var num = 0;
                let black = 0;

                for (i = 1; i <= Math.floor(row.avg_rate); i++) {

                    
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star checked");
                    span_obj.style = "font-size:28px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    num = i;
                    console.log('num in for loop ' + num);
                }
                var fraction = row.avg_rate - num;
               
                if (fraction) {
                    var span_obj = document.createElement("span");
                    span_obj.setAttribute("class", "fa fa-star-half-o");
                    span_obj.style = "font-size:28px;cursor:pointer;color:orange";
                    element.appendChild(span_obj);
                    black = 5 - Math.ceil(row.avg_rate);
                    console.log('fraction inside ' + fraction);
                }
                else
                {
                    black = 5 - Math.floor(row.avg_rate);
                    
                }
                console.log('black ' + black);

            
                    for (i = 0; i < black; i++) {
                        var span_obj = document.createElement("span");
                        span_obj.setAttribute("class", "fa fa-star-o");
                        span_obj.style = "font-size:28px;cursor:pointer;border:orange";
                        element.appendChild(span_obj);
                    }
                
                //console.log(avg_star.avg_rate)
            });
         
           
        }
    }
    var doc_id = sessionStorage.getItem("doctor_id");

    console.log(doc_id);

    xhttp.open("POST", "/average_review", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"Doc_id":"' + doc_id + '"}');

}


function display_review_analysis() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var rating_results = JSON.parse(this.responseText);
            
            console.log(rating_results);

            let total_ratings = 0;

            var found1 = found2 = found3 = found4 = found5 =false;
           

            rating_results.forEach((row) => {

                total_ratings = total_ratings + row.input;
            });

            document.getElementById("total_reviews").innerHTML = 'based on ' + total_ratings + ' reviews';
            console.log("response from server");
            console.log(total_ratings);
            rating_results.forEach((row) => {
alert(row.rating);
                
                if (row.rating == 5) {
                    document.getElementById("rate5").innerHTML = row.input;
                    let width = (row.input / total_ratings) * 100;
                    document.getElementById("bar5").style.width = width + '%';
                    found5 = true;

                }
                if (row.rating == 4) {
                    document.getElementById("rate4").innerHTML = row.input;
                    let width = (row.input / total_ratings) * 100;
                    document.getElementById("bar4").style.width = width + '%';
                    found4 = true;
                }

                if (row.rating == 3) {
                    document.getElementById("rate3").innerHTML = row.input;
                    let width = (row.input / total_ratings) * 100;
                    document.getElementById("bar3").style.width = width + '%';
                    found3 = true;
                }

                if (row.rating == 2) {
                    document.getElementById("rate2").innerHTML = row.input;
                    let width = (row.input / total_ratings) * 100;
                    document.getElementById("bar2").style.width = width + '%';
                    found2 = true;
                }

                if (row.rating == 1) {
                    document.getElementById("rate1").innerHTML = row.input;
                    let width = (row.input / total_ratings) * 100;
                    document.getElementById("bar1").style.width = width + '%';
                    found1 = true;
                }

            });


            if (found5 == false) {
                document.getElementById("rate5").innerHTML = '0';            
                document.getElementById("bar5").style.width =  '0%';
            }
            if (found4 == false) {
                document.getElementById("rate4").innerHTML = '0';
                document.getElementById("bar4").style.width = '0%';
            }
            if (found3 == false) {
                document.getElementById("rate3").innerHTML = '0';
                document.getElementById("bar3").style.width = '0%';
            }
            if (found2 == false) {
                document.getElementById("rate2").innerHTML = '0';
                document.getElementById("bar2").style.width = '0%';
            }
            if (found1 == false) {
                document.getElementById("rate1").innerHTML = '0';
                document.getElementById("bar1").style.width = '0%';
            }
        }
    }
    var doc_id = sessionStorage.getItem("doctor_id");

    xhttp.open("POST", "/display_review_analysis", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"Doc_id":"' + doc_id + '"}');

}
