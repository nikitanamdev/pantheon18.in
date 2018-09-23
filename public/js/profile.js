const requrl = 'http://localhost:5000';
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
            window.location.href = 'index.html';
            //console.log(result);
            // console.log('deleted');
        })
        .fail((err) => {
            //console.log(err);
            alert("Some error occured. Try Again later.")
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
            //console.log('Updated');
            window.location.href = 'profile.html';
        })
        .fail((err) => {
            alert("Some error occured. Try Again later.")
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
    $(document).on("click" ,'.reqq', function(){
        const id= this.id;
        const idd = id.substring(1,id.length);
        if(id[0]=='c'){
             $.ajax({
                     type: 'GET',
                     url: requrl + '/api/acceptRequest/' + $('#request'+idd).val(),
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
                     //console.log(err);
                     alert("Some error occured. Try Again later.")
                     window.location.href = 'profile.html';
                 });
        }
        else{
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
                    //console.log(err);
                    alert("Some error occured. Try Again later.")
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
            $("#fName").val(result.user[0].name);
            $("#email").val(result.user[0].email);
            $("#contact").val(result.user[0].contact);
            $("#dob").val(result.user[0].dob);
            $("#clgname").val(result.user[0].collegeName);
            $("#clgcity").val(result.user[0].collegeCity);
            $("#clgstate").val(result.user[0].collegeState);
            $("#rollnum").val(result.user[0].collegeId);
            $("#gradYear").val(result.user[0].gradYear);
            $('#panID').val('PA'+result.user[0].panId);
            $('#gender').val(result.user[0].gender.toUpperCase());


            if(result.isTeamLeader === 'yes') {
                // Team Leader
                $('#teamName').val(result.teamDetails.teamName);
                for(let i=0;i<result.teamDetails['teamMembers'].length;i++){
                    $(".jumbotron").append('<div class="input-container"><i class="fa fa-chevron-right icon" aria-hidden="true"></i><input type="text" name="member" class="input-field" id="member' + (i + 1) + '" value="' + result.teamDetails['teamMembers'][i] + '" placeholder="' + result.teamDetails['teamMembers'][i] + '" disabled><div class="description"><span><i class="fas fa-times" style="padding-left:15%;padding-top: 20%;" onclick="deleteMember(' + result.teamDetails['teamMembers'][i] + ')"></i></span></div></div>');
                }
            } else if(result.isTeamLeader === 'no') {
                if (result['teamRequests'].length === 0){
                    $(".jumbotron").append('<h3 class="text-center">No Requests Recieved till now.</h3>')
                }
                for (let i = 0; i < result['teamRequests'].length; i++) {
                    $(".jumbotron").append('<div class="input-container"><i class="fa fa-chevron-right icon" aria-hidden="true"></i><input type="text" name="member" class="input-field" id="request' + (i + 1) + '" value="' + result['teamRequests'][i] + '" placeholder="' + result['teamRequests'][i] + '" disabled><div class="description"><span><i id="c' + (i + 1) + '" class="fas fa-check reqq" style="padding-left:5%;padding-right: 15%;padding-top: 20%;"></i></span><span><i id="w' + (i + 1) + '" class="fas fa-times reqq" style="padding-left:15%;padding-right: 5%;padding-top: 20%;"></i></span></div></div>');
                }
            } else {
                window.location.href = 'profile.html';
            }
        })
        .fail((err) => {
            //console.log(err);
            alert("Some error occured. Try Again later.")
            window.location.href = 'profile.html';
        });
});
