$(document).ready(function () {
    $('.delete').click((e) => {
        e.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: 'https://www.pantheon18.in/api/profile',
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
            url: 'https://www.pantheon18.in/api/profile',
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
    $.ajax({
            type: 'GET',
            url: 'https://www.pantheon18.in/api/profile',
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

        })
        .fail((err) => {
            //console.log(err);
            alert("Some error occured. Try Again later.")
            window.location.href = 'profile.html';
        });
});
