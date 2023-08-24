document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.image-thumbnail');
    const previewImage = document.getElementById('previewImage');




    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => updatePreviewImage(index));
    });

    function updatePreviewImage(index) {
        const images = document.querySelectorAll('.image-thumbnail img');
        const previewImage = document.getElementById('previewImage');
        currentImageIndex = index;
        previewImage.src = images[currentImageIndex].src;
    }

    let currentImageIndex = 0;

    function changeImage(direction) {
        const images = document.querySelectorAll('.image-thumbnail img');
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        } else if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
        updatePreviewImage(currentImageIndex);
    }

    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    prevButton.addEventListener('click', () => changeImage(-1));
    nextButton.addEventListener('click', () => changeImage(1));

    updatePreviewImage(0);
});



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
    
        const addToCartSuccess = document.getElementById("addedToCartMsg");
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
    .then((response) => response.text()) // Change this line to response.text()
    .then((responseText) => {
        console.log(responseText); // Log the raw response text
        const data = JSON.parse(responseText);
        // Rest of your code handling parsed data
    
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