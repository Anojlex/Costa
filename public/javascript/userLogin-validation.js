document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("login-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
       
        var emailInput = document.getElementById("email");
        var passwordInput = document.getElementById("password");
       
        var emailError = document.getElementById("email-error");
        var passwordError = document.getElementById("password-error");
      
        emailError.textContent = "";
        passwordError.textContent = "";
        
        var isValid = true;
        
        
        var emailRegex = /^\S+@\S+\.\S+$/;
        
        if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = "Enter a valid email address";
            isValid = false;
        }
        
        if (passwordInput.value.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters";
            isValid = false;
        }
      
        if (isValid) {
            form.submit();
        }
    });
});



