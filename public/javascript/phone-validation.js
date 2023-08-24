document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("phone-otp-form-v");
  form.addEventListener("submit", function(event) {
      event.preventDefault(); 
      
     
      
      var phoneInput = document.getElementById("phone");
     

      var phoneError = document.getElementById("phone-error");
     
    
   
  phoneError.textContent = "";
      
      var isValid = true;
      
      if (phoneInput.value.length < 10|| phoneInput.value.length>10) {
          phoneError.textContent = "Enter a valid phone number"
          isValid = false;
      }
    
      if (isValid) {
          form.submit();
      }
  });
});
