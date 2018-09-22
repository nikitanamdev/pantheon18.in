$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'https://www.pantheon18.in/api/preTeamRegistration',
        headers: {
            'token': localStorage.getItem('token')
        },
    }).done((res) => {
        if(res.status === 'success'){
            const leaderEmail = res.email;
            $('#leaderEmail').val(leaderEmail);
        }
        else{
            alert(res.message);
            //window.location.href = 'team_registration.html';
        }
    }).fail((err) => {
        console.log(err);
        //window.location.href = 'team_registration.html';
    });

    $('.teambutton').click((e) => {
        e.preventDefault();
        const teamName = $('#team').val();
        const teamPass = $('#pass').val();
        const teamSize = $('#count').val();
        var teamMembers = [];
        teamMembers.push($('#leaderEmail').val());
        for(i=2;i<=teamSize;i++){
            teamMembers.push($('#member'+i).val());
        }
        console.log(teamMembers);
        $.ajax({
            type: 'POST',
            url: 'https://www.pantheon18.in/api/teamRegister',
            headers: {
                'token': localStorage.getItem('token')
            },
            data : {
                teamName : teamName,
                teamPass : teamPass,
                teamMembers : teamMembers
            }
        }).done((res) => {
            if(res.status === 'success'){
                alert(res.message);
            }
            else{
                alert(res.message);
                //window.location.href = 'team_registration.html';
            }
        }).fail((err) => {
            console.log(err);
            //window.location.href = 'team_registration.html';
        });
    })
});
