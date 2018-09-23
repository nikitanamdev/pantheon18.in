const requrl = "http://localhost:5000";

$(document).ready(function () {
    $(".register-button").click((e)=>{
        e.preventDefault();
        const EventValue = 23;
        const TeamName = $("#team-name").val().trim();
        const TeamPass = $("#team-pass").val();
        $.ajax({
            type: 'POST',
            url: requrl + '/api/eventRegister' ,
            data: {
                teamName: TeamName,
                password: TeamPass,
                eventValue: EventValue
            }
        })
        .done((result) => {
            if(result.status === 'fail'){
                alert(result.message);
                location.reload(true);
            } else if(result.status === 'success') {
                alert(result.message);
                location.reload(true);
            }
        })
        .fail(err => {
            alert("Some error occured. Please try again later.")
            location.reload(true);
        });
    });
});
