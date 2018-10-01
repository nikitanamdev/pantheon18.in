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
        const TeamName1 = $("#teamName1").val().trim();
        const Points1 = $("#points1").val();
        const TeamName2 = $("#teamName2").val().trim();
        const Points2 = $("#points2").val();
        const TeamName3 = $("#teamName3").val().trim();
        const Points3 = $("#points3").val();
        // make the payload
        $.ajax({
            type: "POST",
            url : requrl + "/api/pointUpdate",
            headers: {
                'token' : localStorage.getItem('token')
            },
            data: payload
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