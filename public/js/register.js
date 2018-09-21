$('.readmore').click(function () {
    $('.content').toggleClass('full');
    $('.header').toggleClass('collapse');
    $('.readmore').toggle();
});
$('.closebttn').click(function () {
    $('.content').removeClass('full');
    $('.header').removeClass('collapse');
    $('.readmore').toggle();
});

/**
 * Disables keypress events in this page
 */
$('#msform').on('keyup keypress', function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var pName,pEmail,pPass,pCpass,pContact;


$(".next").click(function () {

    if(validate_form($(this).val())===false){
        //console.log($(this).val());
        return;
    }

    pName=$("#fName").val();
    pEmail=$("#email").val();
    pPass=$("#pass").val();
    pCpass=$("#cpass").val();
    pContact=$("#contact").val();

    $("#rfname").val(pName);
    $("#rphone").val(pContact);

    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({
                'left': left,
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function () {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".previous").click(function () {
    grecaptcha.reset();
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'left': left
            });
            previous_fs.css({
                'transform': 'scale(' + scale + ')',
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function () {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".submit").click(function () {
    // This is the final submit after which the user is saved to db.
    const dob = $("#dob").val();
    const clgname = $("#clgname").val();
    const clgcity = $("#clgcity").val();
    const clgstate = $("#clgstate").val();
    const rollnum = $("#rollnum").val();
    const gradYear = $("#gradYear").val();
    if(gradYear < 1900 || gradYear > 2050){
        alert("Enter valid Year of Graduation.");
        $("#gradYear").val("");
    }
    const email = $("#emailbox").val();
    const gender = $("input[name='gender']:checked").val().toString();
    const payload = {
        email: email,
        dob: dob,
        clgname: clgname,
        clgcity: clgcity,
        clgstate: clgstate,
        rollnum: rollnum,
        gradYear: gradYear,
        gender: gender
    };
    $.ajax({
        type: 'POST',
        url: "https://www.pantheon18.in/api/submit",
        data: payload
    }).done((data) => {
        //console.log(data);
        if (data.status === 'success') {
            alert("You have been successfully registered.")
            // window redirect code
            location.reload(true);
        } else {
            alert(data.message);
        }
    }).fail((err) => {
        console.log(err);
        alert("Something went wrong!! Please try again.")
    });
    return false;
});

function validate_form(valCheck) {
    if(valCheck==="Next") {
        //console.log('good');
        var error=0;
        var pName=$("#fName").val();

        if(pName==="") {
            alert("Enter Name");
            grecaptcha.reset();
            return false;
        }

        const mail = $("#email").val();
        $("#emailbox").val(mail);
        const regmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(mail==="") {
            alert("Enter Email");
            grecaptcha.reset();
            return false;
        }
        if(!regmail.test(mail)){
            $("#email").val("");
            alert("Enter valid email address");
            grecaptcha.reset();
            return false;
        }

        const password = $("#pass").val();
        if(password.length<5) {
            alert("Password should be atleast 5 characters long");
            grecaptcha.reset();
            return false;
        }

        const confirmPassword = $("#cpass").val();
        if (password !== confirmPassword) {
            $("#pass").val("");
            $("#cpass").val("");
            alert("Passwords do not match.");
            grecaptcha.reset();
            return false;
        }

        const phone = $("#contact").val();
        const phoneNum = parseInt(phone.toString().trim());
        if( !(phoneNum >=1000000000 && phoneNum <=9999999999) ){
            $("#contact").val("");
            alert("Enter valid phone number");
            grecaptcha.reset();
            return false;
        }
        const payload = {
            name: pName,
            email: mail,
            pass: password,
            cpass: confirmPassword,
            contact: phone,
            "g-recaptcha-response": grecaptcha.getResponse()
        };
        // AJAX request code
        $.ajax({
            type: 'POST',
            url: 'https://www.pantheon18.in/api/register',
            data: payload
        }).done((data)=>{
            if(data.status === 'exists') {
                alert(data.message);
                // windows redirect code
                location.reload(true);
            }
            return true;
        }).fail((err) => {
            console.log(err);
            alert("Some thing went wrong!!! PLease try again.");
            location.reload(true);
        });
    }
    else if(valCheck==="Verify") {
        // OTP Checking code
        const emailotp = $("#emailotp").val();
        const mobileotp = $("#mobileotp").val();
        const email = $("#emailbox").val();
        const payload = {
            email: email,
            emailotp: emailotp,
            mobileotp: mobileotp
        }
        $.ajax({
            type: 'POST',
            url: 'https://www.pantheon18.in/api/verify',
            data: payload
        }).done((data)=>{
            //console.log(data);
            if(data.status === 'fail'){
                $("#emailotp").val("");
                $("#mobileotp").val("");
                alert(data.message);
                location.reload(true);
            } else {
                return true;
            }

        }).fail((err) => {
            //console.log(err);
            alert("Some thing went wrong!!! PLease try again.");
            location.reload(true);
        });
    }
    else {
        //window redirect code
        location.reload(true);
    }
}

$("#clg1").click(function() {
    $("#clgname").val("Birla Institute of Technolgy, Mesra");
    $("#clgcity").val("Ranchi");
    $("#clgstate").val("Jharkhand");
    $("#sap").remove();
    $("#clgname").prop("disabled",true);
    $("#clgcity").prop("disabled",true);
    $("#clgstate").prop("disabled",true);
});

$("#clg2").click(function(){
    $("#clgSelect").append("<input type='text' name='sapid' id='sap' placeholder='SAP ID (optional)'>");
    $("#clgname").val("");
    $("#clgcity").val("");
    $("#clgstate").val("");
    $("#clgname").prop("disabled",false);
    $("#clgcity").prop("disabled",false);
    $("#clgstate").prop("disabled",false);
});
/*
*/
