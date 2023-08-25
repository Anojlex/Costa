

const addToCart = (productId) => {
  
   
    fetch("/home/singleProduct/addToCart", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productId: productId,
        }),
    })
    .then((response) => response.text()) // Change this line to response.text()
    .then((responseText) => {
       // Log the raw response text
        const data = JSON.parse(responseText);
        // Rest of your code handling parsed data
    
        const addToCartSuccess = document.getElementById("<%= men1[i]._id %>");
        const addToCartError = document.getElementById("addToCartError");

        if (data.success) {
            loader.style.display = "none"; 
         
            addToCartSuccess.textContent = data.message;
        
            addToCartError.textContent = "";
         
            setTimeout(() => {
               
                addToCartSuccess.textContent = "";
            }, 1500);
            console.log("After setTimeout");
        } 
            if (!data.success) {
                addToCartSuccess.textContent = "";
                addToCartError.textContent = "Please login";
            
                if (data.redirectTo) {
                    window.location.href = data.redirectTo;
                }
            }
            
    })
    .catch((error) => {
        console.error("Error occurred:", error);
        loader.style.display = "none"; // Hide the loader in case of an error.
    });
};


const addToWishlist=(productId)=>{
   

    fetch("/home/singleProduct/addToWishlist", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productId: productId,
        }),
    })
    .then((response) => response.text()) 
    .then((responseText) => {
       
        const data = JSON.parse(responseText);
      
    
        const addToCartSuccess = document.getElementById("addedToCartMsg");
        const addToCartError = document.getElementById("addToCartError");

        if (data.success) {
            loader.style.display = "none"; 
            addToCartSuccess.textContent = data.message;
            addToCartError.textContent = "";

            setTimeout(() => {
                addToCartSuccess.textContent = "";
            }, 1500);
        } 
        if (!data.success) {
            addToCartSuccess.textContent = "";
            addToCartError.textContent = "Please login";
        
            if (data.redirectTo) {
                window.location.href = data.redirectTo;
            }
        }
    })
    .catch((error) => {
        console.error("Error occurred:", error);
        loader.style.display = "none"; // Hide the loader in case of an error.
    });
}