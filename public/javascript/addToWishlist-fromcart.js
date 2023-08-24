function showAddedToCartMessage() {
    const addedToCartMsg = document.getElementById("addedToWishlistMsg");
    addedToCartMsg.style.display = "block";
    setTimeout(() => {
        addedToCartMsg.style.display = "none";
    }, 1000); // Hide the message after 3 seconds
}

// Function to show the loader
function showLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    setTimeout(() => {
        loader.style.display = "none";
        showAddedToCartMessage();
    }, 1100);
}


const addToCartButton = document.querySelector(".btn-addtowishlist");
addToCartButton.addEventListener("click", () => {
   
    showLoader();
});





