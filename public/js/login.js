const requrl = "http://localhost:5000";

$(document).ready(function () {
    $('#login').click((e) => {
        e.preventDefault();
        const email = $('#email').val();
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
                //console.log(token);
                window.location.href = 'profile.html'
            }
            else{
                alert(res.message);
                window.location.href = 'login.html';
            }
        }).fail((err) => {
            //console.log(err);
            window.location.href = 'login.html';
        });
    });
});
