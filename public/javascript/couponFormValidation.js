function validateForm() {
    clearErrorMessages();

    const couponCode = document.getElementById("coupon-code").value;
    const percentage = document.getElementById("percentage").value;
    const minPurchase = document.getElementById("min-purchase").value;
    const maxAmount = document.getElementById("max-amount").value;
    const expiryDate = document.getElementById("date").value;

    let isValid = true;

    if (couponCode.trim() === '' || couponCode.length < 5) {
        displayErrorMessage("coupon-code-error", "Please enter a valid Coupon code.");
        isValid = false;
    }

    if (percentage.trim() === '') {
        displayErrorMessage("percentage-error", "Please enter the percentage.");
        isValid = false;
    } else if (isNaN(parseFloat(percentage))) {
        displayErrorMessage("percentage-error", "Percentage must be a valid number.");
        isValid = false;
    }

    if (minPurchase.trim() === '') {
        displayErrorMessage("min-purchase-error", "Please enter the Min Purchase.");
        isValid = false;
    } else if (isNaN(parseFloat(minPurchase))) {
        displayErrorMessage("min-purchase-error", "Min Purchase must be a valid number.");
        isValid = false;
    }
    if (maxAmount.trim() === '') {
        displayErrorMessage("max-amount-error", "Please enter the Max Amount.");
        isValid = false;
    } else if (isNaN(parseFloat(maxAmount))) {
        displayErrorMessage("max-amount-error", "Amount must be a valid number.");
        isValid = false;
    }
    if (expiryDate.trim() === '') {
        displayErrorMessage("expiry-error", "Please enter the Expiry date.");
        isValid = false;
    } else {
        const currentDate = new Date();
        const selectedDate = new Date(expiryDate);
        if (selectedDate <= currentDate) {
            displayErrorMessage("expiry-error", "Expiry date must be in the future.");
            isValid = false;
        }
    }

    if (!isValid) {
        // If any validation failed, prevent form submission
        return false;
    }

    // Continue with form submission logic
    const formData = {
        code: couponCode,
        percentage: percentage,
        minpurchase: minPurchase,
        maxAmount:maxAmount,
        expiry: expiryDate
    };
  
    fetch('/admin/addCoupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displaySuccessMessage("Coupon added successfully!");
        } else {
            displayErrorMessage("coupon-code-error", data.message);
        }
    })
    .catch(error => {
        displayErrorMessage("coupon-code-error", "An error occurred while processing your request.");
    });

    // Prevent the default form submission
    return false;
}



function displaySuccessMessage(message) {
    const successElement = document.getElementById("coupon-added-message");
    successElement.textContent = message;
    document.getElementById("coupon-code").value = "";
    document.getElementById("percentage").value = "";
    document.getElementById("min-purchase").value = "";
    document.getElementById("date").value = "";
    setTimeout(()=>{
       window.location.reload()
    },1200) 
}


function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
        element.textContent = "";
    });
}