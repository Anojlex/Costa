document.addEventListener("DOMContentLoaded", function() {
    var form = document.querySelector(".signup-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get form inputs
        var categoryInput = document.getElementById("category");
       
        
        // Get error message elements
        var categoryError = document.getElementById("category-error");
        
        
      
        categoryError.textContent = "";
        
      
        var isValid = true;
        
        if (categoryInput.value.length < 4) {
            categoryError.textContent = "Category must be at least 4 characters";
            isValid = false;
        }    
       
        if (isValid) {
            form.submit();
        }
    });
});
