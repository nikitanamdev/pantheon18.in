const requrl = "https://www.pantheon18.in";
$(document).ready(function () {
    $("#form-submit").click((e) => {
        const name = $("#name").val().trim();
        const contact = $("#name").val().trim();
        const comment = $("#comment").val().trim();
        $.ajax({
            type: "POST",
            url : requrl + "/api/feedback",
            data : {
                name : name,
                contact: contact,
                comment: comment
            }
        })
        .done((result) => {
            alert(result.message);
            location.reload(true);
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'feedback.html';
        });
    });
});