const requrl = 'http://localhost:5000'
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: requrl + '/api/preTeamRegistration',
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
        window.location.href = 'team_registration.html';
    });

    $('.teambutton').click((e) => {
        e.preventDefault();
        const teamName = $('#team').val().trim();
        const teamPass = $('#pass').val();
        const teamSize = $('#count').val();
        var teamMembers = [], equity = 0;
        //teamMembers.push($('#leaderEmail').val().trim());
        for(let i=2;i<=teamSize;i++){
            const newMemberValue = $('#member' + i).val().trim();
            for(let j=0;j<teamMembers.length;j++){
                if(newMemberValue === teamMembers[j]){
                    equity = 1;
                    $('#member' + i).val("");
                }
            }
            teamMembers.push(newMemberValue);
        }
        if(equity === 1) {
            alert("Enter Unique Members.");
            return false;
        }
        console.log(teamMembers);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/teamRegister',
            headers: {
                'token': localStorage.getItem('token')
            },
            data : {
                teamName : teamName,
                teamPass : teamPass,
                teamMembers : teamMembers
            }
        }).done((res) => {
            console.log(res);
            if(res.status === 'success'){
                alert(res.message);
                window.location.href = 'index.html';
            }
            else{
                alert(res.message);
                window.location.href = 'index.html';
            }
        }).fail((err) => {
            console.log(err);
            window.location.href = 'index.html';
        });
    })
});
