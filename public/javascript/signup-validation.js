document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("signup-form-v");
  form.addEventListener("submit", function(event) {
      event.preventDefault(); 
      
      var firstnameInput=document.getElementById("firstname");
      var lastnameInput=document.getElementById("lastname");
      var emailInput = document.getElementById("email");
      var passwordInput = document.getElementById("password");
     
      var firstnameError=document.getElementById("firstname-error")
      var lastnameError=document.getElementById("lastname-error")
      var emailError = document.getElementById("email-error");
      var passwordError = document.getElementById("password-error");
    
      firstnameError.textContent=""
      lastnameError.textContent=""
      emailError.textContent = "";
      passwordError.textContent = "";
      
      
      var isValid = true;
      
      
      if (firstnameInput.value.length<4){
        firstnameError.textContent="First Name should have atleast 4 characters";
        isValid=false;
      }

      if (lastnameInput.value.length<1){
        lastnameError.textContent="Last can't be Empty";
        isValid=false;
      }

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
