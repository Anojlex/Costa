
document.addEventListener("DOMContentLoaded", function() {
    var form = document.querySelector(".signup-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get form inputs 
        var nameInput = document.getElementById("name");
        var emailInput = document.getElementById("email");
        var mobileInput = document.getElementById("mobile");
        var passwordInput = document.getElementById("password");
        
        // Get error message elements
        var nameError = document.getElementById("name-error");
        var emailError = document.getElementById("email-error");
        var mobileError = document.getElementById("mobile-error");
        var passwordError = document.getElementById("password-error");
        
        // Reset error messages
        nameError.textContent = "";
        emailError.textContent = "";
        mobileError.textContent = "";
        passwordError.textContent = "";
        
        // Validate inputs
        var isValid = true;
        
        if (nameInput.value.length < 4) {
            nameError.textContent = "Name must be at least 4 characters";
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

