
    document.addEventListener("DOMContentLoaded", function() {
        var form = document.querySelector(".signup-form");
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get form inputs
            var firstnameInput = document.getElementById("name");
            var lastnameInput = document.getElementById("name");
            var emailInput = document.getElementById("email");
            var mobileInput = document.getElementById("mobile");
            var passwordInput = document.getElementById("password");
            
            // Get error message elements
            var firstnameError = document.getElementById("firstname-error");
            var lastnameError = document.getElementById("lastname-error");
            var emailError = document.getElementById("email-error");
            var mobileError = document.getElementById("mobile-error");
            var passwordError = document.getElementById("password-error");
            
          
            firstnameError.textContent = "";
            lastnameError.textContent = "";
            emailError.textContent = "";
            mobileError.textContent = "";
            passwordError.textContent = "";
            
         
            var isValid = true;
            
            if (firstnameInput.value.length < 4) {
                firstnameError.textContent = "First Name must be at least 4 characters";
                isValid = false;
            }
            if (lastnameInput.value.length < 1) {
                lastnameError.textContent = "Last Name required";
                isValid = false;
            }
            // Regular expression to check email syntax
            var emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.textContent = "Invalid email address";
                isValid = false;
            }
            
            // Regular expression to check 10-digit phone number
            var mobileRegex = /^\d{10}$/;
            if (!mobileRegex.test(mobileInput.value)) {
                mobileError.textContent = "Invalid mobile number";
                isValid = false;
            }
            
            if (passwordInput.value.length < 6) {
                passwordError.textContent = "Password must be at least 6 characters";
                isValid = false;
            }
            
            // If all inputs are valid, submit the form
            if (isValid) {
                form.submit();
            }
        });
    });

