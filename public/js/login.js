//const requrl = "https://www.pantheon18.in";
const requrl = "https://www.pantheon18.in";
$(document).ready(function () {
    $('#login').click((e) => {
        e.preventDefault();
        if(validate_form()===false){
            return;
        }
        const email = $('#email').val().trim();
        const password = $('#pass').val();
        $.ajax({
            type: 'POST',
            url: requrl + '/api/login',
            data: {
                email: email,
                password: password
            }
        }).done((res) => {
            if(res.status === 'success'){
                const token = 'bearer ' +  res.token;
                localStorage.setItem('token', token);
                window.location.href = 'profile.html'
            }
            else{
                alert(res.message);
                window.location.href = 'login.html';
            }
        }).fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'login.html';
        });
    });
});
function validate_form() {
    const mail = $("#email").val().trim();
    const regmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if(mail==="") {
            alert("Enter Email");
            return false;
        }
    if(!regmail.test(mail)){
            $("#email").val("");
            alert("Enter valid email address");
            return false;
        }
    const password = $("#pass").val();
    if(password.length<1) {
            alert("Please Enter the password");
            return false;
        }
}
