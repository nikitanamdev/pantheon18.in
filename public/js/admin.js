const requrl = "https://www.pantheon18.in";
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: requrl + '/api/adminRights',
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
        window.location.href = 'index.html';
    });
    $("#userDetailsButton").click((e) => {
        e.preventDefault();
        const panid = $("#panid").val().trim();
        $.ajax({
            type: 'POST',
            url: requrl + '/api/searchUser',
            data: {
                panId: panid
            },
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if (result.status === 'fail') {
                alert(result.message);
                location.reload(true);
            } else {
                $("#listUserData").empty();
                $("#listUserData").append("<tr><td>" + result.data.name + "</td><td> PA" + result.data.panId + "</td><td>" + result.data.collegeName + "</td><td>" + result.data.collegeId + "</td><td>" + result.data.email + "</td></tr>");
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'admin.html';
        });
    });

    $("#userVerifyButton").click((e) => {
        e.preventDefault();
        const panid = $("#panid").val().trim();
        $.ajax({
            type: 'POST',
            url : requrl + '/api/verifyUser',
            data: {
                panId: panid
            },
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            alert(result.message);
            location.reload(true);
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'admin.html';
        });
    });

    $('#teamVerifyButton').click((e) => {
        e.preventDefault();
        const TeamName = $("#teamName").val().trim();
        $.ajax({
            type: 'POST',
            url : requrl + "/api/verifyTeam",
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

    $("#teamDetailsButton").click((e) => {
        e.preventDefault();
        const TeamName = $("#teamName").val().trim();
        $.ajax({
            type: 'POST',
            url: requrl + '/api/searchTeam',
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
                // get the data and append it in the li
                $("#listTeamData").empty();
                for(let i=0;i<result.count;i++){
                    $("#listTeamData").append("<tr><td>" + result.teamMembers[i].name + "</td><td> PA" + result.teamMembers[i].panId + "</td><td>"+ result.teamMembers[i].collegeId +"</td><td>" + result.teamMembers[i].email + "</td></tr>");
                } 
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'admin.html';
        });
    });

    $("#verifyTeamEvent").click((e) => {
        e.preventDefault();
        const teamName = $("#teamName").val().trim();
        const eventCode = $("#event").val();
        $.ajax({
            type: 'POST',
            url: requrl + '/api/eventTeamVerify',
            data: {
                teamName: teamName,
                eventValue : eventCode                
            },
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            alert(result.message);
            location.reload(true);
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'admin.html';
        });
    });
    
});