
document.addEventListener("DOMContentLoaded", function() {
    var form = document.querySelector(".signup-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        
        var categoryInput = document.getElementById("category");
       
        var categoryError = document.getElementById("category-error");

        var categorySuccess = document.getElementById("category-success");
                  
        categoryError.textContent = "";
             
        var isValid = true;
       
        if (categoryInput.value.length < 4) {
            categoryError.textContent = "Category must be at least 4 characters";
            isValid = false;
        }    
       
        if (isValid) {
            fetch("/admin/addCategory", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                 category:categoryInput.value
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    categorySuccess.textContent = data.message;
                    document.getElementById("category").value=""
                    setTimeout(()=>{
                      window.location.reload()
                    },1200)
                   
                  } else {
                   
                    categoryError.textContent = data.message;
                  }
                })
                .catch((error) => {
                  console.error("Error occurred:", error);
                });
            }
      })
    });


