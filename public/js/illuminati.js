const requrl = "https://www.pantheon18.in";

$(document).ready(function () {
    $(".register-button").click((e)=>{
        e.preventDefault();
        const EventValue = 23;
        const TeamName = $("#team-name").val().trim();
        if (TeamName === null || TeamName.length < 1) {
            alert("Enter Team Name.");
            location.reload(true);
            return false;
        }
        const TeamPass = $("#team-pass").val();
        if (TeamPass === null || TeamPass.length < 1) {
            alert("Enter Team Password.");
            location.reload(true);
            return false;
        }
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
                return false;
            } else if(result.status === 'success') {
                alert(result.message);
                location.reload(true);
                return true;
            }
        })
        .fail(err => {
            alert("Some error occured. Please try again later.")
            location.reload(true);
            return false;
        });
    });
});
