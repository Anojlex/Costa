document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("otp-verification-form-v");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
       
        
        var otpInput = document.getElementById("otp");
       

        var otpError = document.getElementById("otp-error");
       
      
     
    otpError.textContent = "";
        
        var isValid = true;
        
        if (otpInput.value.length < 6) {
            otpError.textContent = "OTP must be 6 digits";
            isValid = false;
        }
      
        if (isValid) {
            form.submit();
        }
    });
});
