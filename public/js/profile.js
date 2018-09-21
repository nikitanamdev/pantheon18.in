$(document).ready(function () {
    $('.delete').click((e) => {
        e.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: 'https://www.pantheon18.in:5000/profile',
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            localStorage.setItem('token','');
            window.location.href = 'index';
            //console.log(result);
            // console.log('deleted');
        })
        .fail((err) => {
            //console.log(err);
            alert("Some error occured. Try Again later.")
            window.location.href = 'profile';
        });
    });
    $('.save').click((e) => {
        e.preventDefault();
        const collegeName = $("#clgname").val();
        const collegeCity = $("#clgcity").val();
        const collegeId = $("#rollnum").val();
        const gradYear = $("#gradYear").val();
        const collegeState = $("#clgstate").val();
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
            url: 'https://www.pantheon18.in:5000/profile',
            headers: {
                'token': localStorage.getItem('token')
            },
            data: userDetails
        })
        .done((result) => {
            //console.log('Updated');
            window.location.href = 'profile';
        })
        .fail((err) => {
            alert("Some error occured. Try Again later.")
            window.location.href = 'profile';
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
            url: 'https://www.pantheon18.in:5000/profile',
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
            $('#panID').val(result.user[0].panId);
            $('#gender').val(result.user[0].gender.toUpperCase());

        })
        .fail((err) => {
            //console.log(err);
            alert("Some error occured. Try Again later.")
            window.location.href = 'profile';
        });
});
