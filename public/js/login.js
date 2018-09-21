$(document).ready(function () {
    $('#login').click((e) => {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#pass').val();
        $.ajax({
            type: 'POST',
            url: 'https://www.pantheon18.in/login',
            data: {
                email: email,
                password: password
            }
        }).done((res) => {
            if(res.status === 'success'){
                const token = 'bearer ' +  res.token;
                localStorage.setItem('token', token);
                //console.log(token);
                window.location.href = 'profile'
            }
            else{
                alert('Wrong credentials');
            }
        }).fail((err) => {
            //console.log(err);
            window.location.href = 'login';
        });
    });
});
