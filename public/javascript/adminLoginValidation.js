
document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("adminLogin");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get form inputs
        var usernameInput = document.getElementById("username");
        var passwordInput = document.getElementById("password");
        
        // Get error message elements
        var usernameError = document.getElementById("username-error");
        var passwordError = document.getElementById("password-error");
       
        
        // Reset error messages
        usernameError.textContent = "";
        passwordError.textContent = "";
       
        
        // Validate inputs
        var isValid = true;
        
        if (usernameInput.value.length < 6) {
            usernameError.textContent = "Username must be at least 6 characters";
            isValid = false;
        }
        
        if (passwordInput.value.length < 6) {
            passwordError.textContent = "password must be at least 6 characters";
            isValid = false;
        }
       
        
        // If all inputs are valid, submit the form
        if (isValid) {
            form.submit();
        }
    });
});

