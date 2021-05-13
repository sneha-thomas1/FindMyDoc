var count;

function starmark(item) {
    count = item.id[0];
    sessionStorage.starRating = count;
    var subid = item.id.substring(1);
    for (var i = 0; i < 5; i++) {
        if (i < count) {
            document.getElementById((i + 1) + subid).style.color = "orange";
        }
        else {
            document.getElementById((i + 1) + subid).style.color = "black";
        }


    }

}

//sessionStorage.setItem("doc_id", "101");

function submit_review() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = this.responseText;
            alert(result);
            window.location.href = "javascript: history.back()";

        }

    }

    var review = document.getElementById("comment").value;
    var doc_id = sessionStorage.getItem("doctor_id");
    var reviewer_name = document.getElementById("reviewer_name").value
    //var rating = document.getElementById("rating").value;

    var anonymous_bool = document.getElementById("anonymous").checked;

    if (true == anonymous_bool) {
        reviewer_name = "Anonymous";
    }
    if (document.getElementById("comment").value.length == 0) {
        review = 'No review comments';
    }
    

    console.log(count);
    console.log(review);
    console.log(reviewer_name);
 
    xhttp.open("POST", "/submit_review", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"Doc_id":"' + doc_id + '","Reviewer_name":"' + reviewer_name +'","Review":"' + review + '","Rating":"' + count + '"}');

}