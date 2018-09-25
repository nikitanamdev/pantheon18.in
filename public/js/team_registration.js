const requrl = "https://www.pantheon18.in";
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
            window.location.href = 'index.html';
        }
    }).fail((err) => {
        alert('Some error occured.Please try again.');
        window.location.href = 'index.html';
    });

    $('.teambutton').click((e) => {
        e.preventDefault();
        const teamName = $('#team').val().trim();
        if(teamName=== null || teamName.length < 1){
            alert("Don't leave any field Empty.");
            location.reload(true);
        }
        const teamPass = $('#pass').val();
        if (teamPass === null || teamPass.length < 1) {
            alert("Don't leave any field Empty.");
            location.reload(true);
        }
        const teamSize = $('#count').val();
        if (teamSize === null || teamSize.length < 1) {
            alert("Don't leave any field Empty.");
            location.reload(true);
        }
        var teamMembers = [], equity = 0;
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
            if(res.status === 'success'){
                alert(res.message);
                window.location.href = 'index.html';
            }
            else{
                alert(res.message);
                window.location.href = 'index.html';
            }
        }).fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'index.html';
        });
    });
});
