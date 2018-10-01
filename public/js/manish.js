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
        const TeamName = $("#teamName").val().trim();
        const Points = $("#points").val();
        $.ajax({
            type: "POST",
            url : requrl + "/api/pointUpdate",
            headers: {
                'token' : localStorage.getItem('token')
            },
            data: {
                teamName: TeamName,
                points: Points
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