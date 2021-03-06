var myInput = document.getElementById("pwd");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var special = document.getElementById("special");
var userid_match = document.getElementById("userid");
// When the user clicks on the password field, show the message box

myInput.onfocus = function () {
    document.getElementById("message").style.display = "block";
}

myInput.onblur = function () {
    document.getElementById("message").style.display = "none";
}

myInput.onkeyup = function () {
    var progress_cnt = 0;
    // Validate lowercase letters

    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
        progress_cnt++;
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
        progress_cnt++;
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
        progress_cnt++;
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length

    if (myInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
        progress_cnt++;
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }

    //validate special char

    var specialletters = /[$@$,_,-,.]/g;
    if (myInput.value.match(specialletters)) {
        special.classList.remove("invalid");
        special.classList.add("valid");
        progress_cnt++;
    } else {
        special.classList.remove("valid");
        special.classList.add("invalid");
    }

    // Display it
    var progress = "";
    var strength = "";
    switch (progress_cnt) {
        case 0:
            strength = "Weak";
            progress = "0";
            break;
        case 1:
            strength = "Weak";
            progress = "20";
            break;
        case 2:
            strength = "Weak";
            progress = "40";
            break;
        case 3:
            strength = "Weak";
            progress = "60";
            break;
        case 4:
            strength = "Medium";
            progress = "80";
            break;
        case 5:
            strength = "Strong";
            progress = "100";
            break;

    }

    document.getElementById("progresslabel").innerHTML = strength;
    document.getElementById("progress").value = progress;
}

//display password

function show_password() {
    var x = document.getElementById("pwd");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

//validate password is not same as USER ID
function pwd_userid_check() {

    //alert("Password can not be same as USER id");
    if (myInput.value == userid_match.value) {
        alert("Password can not be same as USER id", null);
        return true;
    }
}

//function to validate password with confirm password

function validate_pwd() {
    var a = document.forms["registration"]["pwd"].value;
    var b = document.forms["registration"]["vpsw"].value;


    if (a != b) {
        alert("Passwords are not matching");
        document.getElementById("userid").value = "";
        document.getElementById("pwd").value = "";
        document.getElementById("vpsw").value = "";

    }

}


function insert()
{
    if (document.getElementById("userid").value.length == 0 || document.getElementById("pwd").value.length == 0 || document.getElementById("vpsw").value.length == 0) {
        document.getElementById("emptyfield").innerHTML = 'Username and password can not be empty';
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = this.responseText;
                alert(result);
                console.log(result);
                //history.previous
                window.location.href = "javascript: history.back()";
                //window.location.href = "Success.html";
            }

        }

        var user_id = document.getElementById("userid").value;
        var pwd = document.getElementById("pwd").value;


        xhttp.open("POST", "/insert", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send('{"user_id":"' + user_id + '","password":"' + pwd + '"}');
    }

}

function login()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        {
            var result = JSON.parse(this.responseText);
            console.log(result);
            


            result.forEach((row) => {
                if (row.success == '1') {
                    console.log(row.success);
                    sessionStorage.setItem("found", "true");
                    window.location.href = "javascript: history.back()";
                    

                }
                else {
                    alert('Invalid username or password');
                   window.location.href = "Password_validation_incorrect_pwd.html";
                   
                }
            });
        }
    }

    var user_id = document.getElementById("userid").value;
    var pwd = document.getElementById("pwd").value;

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"user_id":"' + user_id + '","password":"' + pwd + '"}');
    
}


/*function reset_demo() {
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value="";
    document.getElementById("gender").value ="Decline to answer";
    document.getElementById("age").value="";
    document.getElementById("notes").value="";
    var image = document.getElementById("output");
    image.src = "";
    document.getElementById("file").value = "";
}*/