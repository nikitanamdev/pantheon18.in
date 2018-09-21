$(document).ready(function () {
		let checkPass = function() {
			const password = $("#pwd").val();
            const confirmPassword = $("#pwd-repeat").val();
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return false;
            }
            return true;
		}
		let checkContact = function() {
			const phone = $("#contact").val();
			const regexContact = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/ ;
			if(!regexContact.test(phone)){
				alert("Enter valid phone number");
				return false;
			}
			return true;
		}
		let checkEmail = function() {
			const mail = $("#email").val();
			const regmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			if(!regmail.test(mail)){
				alert("Enter valid email address");
				return false;
			}
			return true;
		}
		let checkYog = function() {
			const yog = $("#yog").val();
			if(isNaN(yog)){
				alert("Year of Graduation must be a number");
				return false;
			}
			return true;
		}
		var userDetails = {};
		var checkemail = 0,checkmobile = 0;
        $("#Button").click(function (e) {
			e.preventDefault();
			// check both passwords
			const pass = checkPass();
			// check contact against regex
			const reg = checkContact();
			const em = checkEmail();
			const yearCheck = checkYog();
			if(pass && reg && em && yearCheck){
				const password = $("#pwd").val();
				const email = $("#email").val();
				const name = $("#name").val();
				const contact = $("#contact").val();

				const collegeName = $("#college-name").val();
				const city = $("#city").val();
				const collegeId = $("#college-id").val();
				const yog = $("#yog").val();
				const gender = $("gender:checked").val();
				userDetails = {
					name,
					email,
					password,
					contact,
					gender,
					collegeName,
					city,
					collegeId,
					yog
				};
				$.ajax({
					type:'POST',
					url:'http://192.168.159.34:5000/sap/verify',
					data: {email,contact},
				}).done((res) => {
					console.log(res);
					checkemail = res.otp.emailOTPsent;
					checkmobile = res.otp.mobileOTPsent;
				}).fail((err) => {
					alert('An error has occurred');
				});
			}
        });
        $("#Button1").click((e) => {
			e.preventDefault();
			const emailOTP = $("#verifyEmail").val();
			const mobileOTP = $("#verifyMobile").val();
			var statusEmail=0,statusMobile=0;
			if(checkemail === emailOTP){
				console.log('Email verified.');
				statusEmail=1;
			}
			else{
				alert('Please enter correct OTP');
			}
			if(checkmobile === mobileOTP){
				console.log('Mobile verified.');
				statusMobile=1;
			}
			else{
				alert('Please enter correct OTP');
			}
			if(statusEmail && statusMobile){
				console.log('Success');
			}
		});
		$("#Button2").click((e) => {
			e.preventDefault();
			$.ajax({
				type : 'POST',
				url : 'http://localhost:5000/sap/signup',
				data : userDetails
			}).done((res) => {
				alert('Registered successfully');
			}).fail((err) => {
				alert('An error has occurred');
			})
		});
    });
