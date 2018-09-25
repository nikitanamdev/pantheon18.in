const requrl = "https://www.pantheon18.in";
$(document).ready(function () {
    $('.delete').click((e) => {
        e.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: requrl + '/api/profile',
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            localStorage.setItem('token','');
            alert("User successfully Deleted.");
            window.location.href = 'index.html';
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'profile.html';
        });
    });
    $('.save').click((e) => {
        e.preventDefault();
        const collegeName = $("#clgname").val();
        if (collegeName === null || collegeName.length < 1) {
            alert("Enter valid College Name");
            $("#clgname").val("");
            return;
        }
        const collegeCity = $("#clgcity").val();
        if (collegeCity === null || collegeCity.length < 1) {
            alert("Enter valid College City");
            $("#clgcity").val("");
            return;
        }
        const collegeState = $("#clgstate").val();
        if (collegeState === null || collegeState.length < 1) {
            alert("Enter valid College State");
            $("#clgstate").val("");
            return;
        }
        const collegeId = $("#rollnum").val();
        if (collegeId === null || collegeId.length < 1) {
            alert("Enter valid College Id");
            $("#rollnum").val("");
            return;
        }
        const gradYear = $("#gradYear").val();
        if(gradYear===null || gradYear < 1900 || gradYear > 2500){
            alert("Enter valid Year of graduation");
            $("#gradYear").val("");
            return;
        }

        const dob = $("#dob").val();
        const userDetails = {
            collegeName,
            collegeCity,
            collegeId,
            collegeState,
            dob,
            gradYear,
            UpdatedAt : new Date().toISOString()
        };
        $.ajax({
            type: 'PATCH',
            url: requrl + '/api/profile',
            headers: {
                'token': localStorage.getItem('token')
            },
            data: userDetails
        })
        .done((result) => {
            window.location.href = 'profile.html';
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'profile.html';
        });
    });
    $('.editProfile').click((e) => {
        e.preventDefault();
        $("i:eq(4)").attr('class',"fa fa-unlock-alt icon");
        $("i:eq(6)").attr('class',"fa fa-unlock-alt icon");
        $("i:eq(7)").attr('class',"fa fa-unlock-alt icon");
        $("i:eq(8)").attr('class',"fa fa-unlock-alt icon");
        $("i:eq(9)").attr('class',"fa fa-unlock-alt icon");
        $("i:eq(10)").attr('class',"fa fa-unlock-alt icon");
        $('.save').removeAttr('disabled');
        $("#dob").removeAttr('disabled');
        $("#clgname").removeAttr('disabled');
        $("#clgcity").removeAttr('disabled');
        $("#clgstate").removeAttr('disabled');
        $("#rollnum").removeAttr('disabled');
        $("#gradYear").removeAttr('disabled');
    });
    $(".logout").click((e)=>{
        e.preventDefault();
        localStorage.setItem('token', '');
        alert("User has been successfully Logged Out.");
        window.location.href = "index.html";
    });

    $(document).on("click",".delete-team",function(e){
        e.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: requrl + '/api/deleteTeam/' + $('#teamName').val().trim(),
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.status === 'success'){
                alert(result.message);
                window.location.href = 'profile.html';
            } else {
                alert(result.message);
                window.location.href = 'profile.html';
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'index.html';
        });
    });
    $(document).on("click" ,'.reqq', function(){
        const id= this.id;
        const idd = id.substring(1,id.length);
        //console.log(requrl + '/api/acceptRequest/' + $('#request' + idd).val().trim());
        if(id[0]=='c'){
             $.ajax({
                     type: 'GET',
                     url: requrl + '/api/acceptRequest/' + $('#request'+idd).val().trim(),
                     headers: {
                         'token': localStorage.getItem('token')
                     }
                 })
                 .done((result) => {
                     if (result.status === 'fail') {
                         alert(result.message);
                         location.reload(true);
                     } else if (result.status === 'success') {
                         alert(result.message);
                         location.reload(true);
                     } else {
                         window.location.href = 'index.html';
                     }
                 })
                 .fail((err) => {
                     console.log(err);
                     alert('Some error occured.Please try again.');
                     window.location.href = 'profile.html';
                 });
        }
        else if(id[0]=='w'){
            $.ajax({
                    type: 'GET',
                    url: requrl + '/api/deleteRequest/' + $('#request' + idd).val(),
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                })
                .done((result) => {
                    if (result.status === 'fail') {
                        alert(result.message);
                        location.reload(true);
                    } else if (result.status === 'success') {
                        alert(result.message);
                        location.reload(true);
                    } else {
                        window.location.href = 'index.html';
                    }
                })
                .fail((err) => {
                    alert('Some error occured.Please try again.');
                    window.location.href = 'profile.html';
                });
        }
        else if(id[0]=='d'){
            $.ajax({
                    type: 'GET',
                    url: requrl + '/api/deleteMember/' + $('#teamName').val()+'/'+$('#member' + idd).val(),
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                })
                .done((result) => {
                    if (result.status === 'fail') {
                        alert(result.message);
                        location.reload(true);
                    } else if (result.status === 'success') {
                        alert(result.message);
                        location.reload(true);
                    } else {
                        window.location.href = 'index.html';
                    }
                })
                .fail((err) => {
                    alert('Some error occured.Please try again.');
                    window.location.href = 'profile.html';
                });
        }

    });


    $.ajax({
            type: 'GET',
            url: requrl + '/api/profile',
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.status === 'fail') {
                alert(result.message);
                window.location.href = "login.html";
            } else {
                $("#fName").val(result.user[0].name);
                $("#email").val(result.user[0].email);
                $("#contact").val(result.user[0].contact);
                $("#dob").val(result.user[0].dob);
                $("#clgname").val(result.user[0].collegeName);
                $("#clgcity").val(result.user[0].collegeCity);
                $("#clgstate").val(result.user[0].collegeState);
                $("#rollnum").val(result.user[0].collegeId);
                $("#gradYear").val(result.user[0].gradYear);
                $('#panID').val('PA' + result.user[0].panId);
                $('#gender').val(result.user[0].gender.toUpperCase());
                if (result.isTeamLeader === 'yes') {
                    // Team Leader
                    $('#teamName').val(result.teamDetails[0].teamName);
                    for (let i = 0; i < result.teamDetails[0].teamMembers.length; i++) {
                        $(".team-details").append('<div class="input-container"><i class="fa fa-chevron-right icon" aria-hidden="true"></i><input type="text" name="member" class="input-field" id="member' + (i + 1) + '" value="' + result.teamDetails[0].teamMembers[i] + '" placeholder="' + result.teamDetails[0].teamMembers[i] + '" disabled><div class="description"><span><i id="d' + (i + 1) + '" class="fas fa-times reqq" style="padding-left:15%;padding-top: 20%;"></i></span></div></div>');
                    }
                    $(".team-details").append('<input type="button" name="Delete-Team" class="delete-team action-button" value="Delete Team"/>');
                } else if (result.isTeamLeader === 'no') {
                    if (result.teamDetails.length > 0) {
                        $('#teamName').val(result.teamDetails[0].teamName);
                        for (let i = 0; i < result.teamDetails[0]['teamMembers'].length; i++) {
                            $(".team-details").append('<div class="input-container"><i class="fa fa-chevron-right icon" aria-hidden="true"></i><input type="text" name="member" class="input-field" id="member' + (i + 1) + '" value="' + result.teamDetails[0].teamMembers[i] + '" placeholder="' + result.teamDetails[0].teamMembers[i] + '" disabled><div class="description"></div></div>');
                        }
                    }
                    if (result['teamRequests'].length === 0 && result.teamDetails.length < 0) {
                        $(".team-details").append('<h3 class="text-center">No Requests Recieved till now.</h3>')
                    }
                    for (let i = 0; i < result['teamRequests'].length; i++) {
                        $(".team-details").append('<div class="input-container"><i class="fa fa-chevron-right icon" aria-hidden="true"></i><input type="text" name="member" class="input-field" id="request' + (i + 1) + '" value="' + result['teamRequests'][i] + '" placeholder="' + result['teamRequests'][i] + '" disabled><div class="description"><span><i id="c' + (i + 1) + '" class="fas fa-check reqq" style="padding-left:5%;padding-right: 15%;padding-top: 20%;"></i></span><span><i id="w' + (i + 1) + '" class="fas fa-times reqq" style="padding-left:15%;padding-right: 5%;padding-top: 20%;"></i></span></div></div>');
                    }

                } else {
                    window.location.href = 'profile.html';
                }
                $("#d1").css({
                    "display": "none"
                });
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'profile.html';
        });
});
