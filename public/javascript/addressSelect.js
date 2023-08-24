function openChangeAddress() {
    document.getElementById("changeaddress").style.display = "flex";
    document.getElementById("overlay").style.display = "block";
  }

  function closeChangeAddress() {
    document.getElementById("changeaddress").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }


  const updateAddressIndex = async (selectedAddressIndex) => {
    try {
      const response = await fetch('/home/cart/changeaddress', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedAddressIndex }),
      });
  
      const data = await response.json();
      if (data.success) {
        
      
         location.reload();
      
      } else {
        console.log("Error occurred");
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };
  


function openaddAddres() {
    document.getElementById("addAddres").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  }
    
    function closeaddAddres() {
      document.getElementById("addAddres").style.display = "none";
      document.getElementById("overlay").style.display = "none";
    }




    
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("addAddresForm");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      var nameInput = document.getElementById("name");
      var mobileInput = document.getElementById("mobile");
      var pincodeInput = document.getElementById("pincode");
      var localityInput = document.getElementById("locality");
      var buildingInput = document.getElementById("buildingname"); // Corrected variable name
      var landmarkInput = document.getElementById("landmark");
      var cityInput = document.getElementById("city");
      var stateInput = document.getElementById("state");
      // Add more inputs here...
  
      // Get error message elements
      var nameError = document.getElementById("name-error");
      var mobileError = document.getElementById("mobile-error");
      var pincodeError = document.getElementById("pincode-error");
      var localityError = document.getElementById("locality-error");
      var buildingError = document.getElementById("buildingname-error"); // Corrected variable name
      var landmarkError = document.getElementById("landmark-error");
      var cityError = document.getElementById("city-error");
      var stateError = document.getElementById("state-error");
      // Add more error message elements here...
  
      // Reset error messages
      nameError.textContent = "";
      mobileError.textContent = "";
      pincodeError.textContent = "";
      localityError.textContent = "";
      buildingError.textContent = ""; // Corrected variable name
      landmarkError.textContent = "";
      cityError.textContent = "";
      stateError.textContent = "";
      // Reset more error messages here...
  
      // Validate inputs
      var isValid = true;
  
      if (nameInput.value.trim() === "") {
        nameError.textContent = "Name is required";
        isValid = false;
      }
  
      if (mobileInput.value.trim() === "" || isNaN(mobileInput.value) || mobileInput.value.length !== 10) {
        mobileError.textContent = "Enter a valid 10-digit mobile number";
        isValid = false;
      }
  
      if (pincodeInput.value.trim() === "" || isNaN(pincodeInput.value) || pincodeInput.value.length !== 6) {
        pincodeError.textContent = "Enter a valid 6-digit pin code";
        isValid = false;
      }
  
      if (localityInput.value.length < 5) {
        localityError.textContent = "Locality/Area/Street must be at least 5 characters";
        isValid = false;
      }
  
      if (buildingInput.value.length < 6) {
        buildingError.textContent = "Building name must be at least 6 characters"; // Corrected error message
        isValid = false;
      }
  
      if (landmarkInput.value.length < 6) {
        landmarkError.textContent = "Landmark must be at least 6 characters";
        isValid = false;
      }
  
      if (cityInput.value.length < 6) {
        cityError.textContent = "City name must be at least 6 characters";
        isValid = false;
      }
  
      if (stateInput.value.length < 6) {
        stateError.textContent = "State is required";
        isValid = false;
      }
  
      if (isValid) {
        form.submit();
      }
    });
  });
  