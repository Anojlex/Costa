
document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("product-form-v");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get form inputs
        var titleInput = document.getElementById("title");
        var descriptionInput = document.getElementById("description");
        var priceInput = document.getElementById("price");
        var salePriceInput = document.getElementById("saleprice");
        
        // Get error message elements
        var titleError = document.getElementById("title-error");
        var descriptionError = document.getElementById("description-error");
        var priceError = document.getElementById("price-error");
        var salePriceError = document.getElementById("saleprice-error");
        
        // Reset error messages
        titleError.textContent = "";
        descriptionError.textContent = "";
        priceError.textContent = "";
        salePriceError.textContent = "";
        
        // Validate inputs
        var isValid = true;
        
        if (titleInput.value.length < 4) {
            titleError.textContent = "Title must be at least 4 characters";
            isValid = false;
        }
        
        if (descriptionInput.value.length < 10) {
            descriptionError.textContent = "Description must be at least 10 characters";
            isValid = false;
        }
        
        if (isNaN(priceInput.value)||priceInput.value.length<1) {
            priceError.textContent = "Enter a valid price";
            isValid = false;
        }
        
        if (isNaN(salePriceInput.value)||salePriceInput.value.length<1) {
            salePriceError.textContent = "Enter a valid selling price";
            isValid = false;
        }
        
        // If all inputs are valid, submit the form
        if (isValid) {
            form.submit();
        }
    });
});

