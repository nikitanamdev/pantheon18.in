$(document).ready(function () {
    $('#Button').click((e) => {
        e.preventDefault();
                const name = $("#name").val();
                const collegeName = $("#college-name").val();
                const city = $("#city").val();
                const collegeId = $("#college-id").val();
                const gradYear = $("#yog").val();
                const userDetails = {
                    name,
                    collegeName,
                    city,
                    collegeId,
                    gradYear
                };
         $.ajax({
            type: 'PATCH',
            url: 'http://localhost:5000/sap/profile',
            headers: {
                'token': localStorage.getItem('token')
            },
            data: userDetails
        })
        .done((result) => {
            console.log('Updated');
            console.log(result);
        })
        .fail((err) => {
            console.log(err);
        });
    });
    $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/sap/profile',
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            console.log(result);
            $("#name").val(result.user.name);
            $("#college-name").val(result.user.collegeName);
            $("#city").val(result.user.city);
            $("#college-id").val(result.user.collegeId);
            $("#yog").val(result.user.gradYear);
        })
        .fail((err) => {
            console.log(err);
        });
});
