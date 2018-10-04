const requrl = "https://www.pantheon18.in";
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: requrl + '/api/manishRights',
        headers: {
            'token': localStorage.getItem('token')
        }
    })
    .done((result) => {
        if(result.status === 'fail'){
            alert(result.message);
            window.location.href = "login.html";
        }
    })
    .fail((err) => {
        alert('Some error occured.Please try again.');
        window.location.href = 'login.html';
    });
    
    $("#updatePoints").click((e) => {
        e.preventDefault();
        const TeamName = $("#teamName1").val().trim();
        const Points = $("#points1").val();
        // make the payload
        $.ajax({
            type: "POST",
            url : requrl + "/api/pointUpdate",
            headers: {
                'token' : localStorage.getItem('token')
            },
            data: {
                teamName : TeamName,
                points : Points
            }
        })
        .done((result) => {
            alert(result.message);
            location.reload(true);
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'login.html';
        })
    });

    $("#push").click((e) => {
        e.preventDefault();
        const msgtitle = $("#title").val().trim();
        const msgbody = $("#message").val().trim();
        // make the payload
        $.ajax({
            type: "POST",
            url : requrl + "/api/saveNotifications",
            headers: {
                'token' : localStorage.getItem('token')
            },
            data: {
                messageTitle: msgtitle,
                messageBody: msgbody
            }
        })
        .done((result) => {
            alert(result.message);
            location.reload(true);
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'login.html';
        })
    });
});