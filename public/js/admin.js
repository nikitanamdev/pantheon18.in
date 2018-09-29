const requrl = "http://localhost:5000"
$(document).ready(function () {
    $('#teamVerifyButton').click((e) => {
        e.preventDefault();
        const TeamName = $("#teamName").val().trim();
        $.ajax({
            type: 'POST',
            url : requrl + "/verifyTeam",
            data: {
                teamName: TeamName
            },
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.status === 'fail') {
                alert(result.message);
                location.reload(true);
            } else {
                alert(result.message);
                location.reload(true);
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'admin.html';
        });
    });
    
});