
const plusAndMinusButtons = document.querySelectorAll(".plusAndMinus");
const quantityError=document.getElementById('quantityError')
// Loop through the buttons and attach a click event listener to each
plusAndMinusButtons.forEach(button => {
  button.addEventListener("click", function(event) {
    // Access the data attributes using getAttribute
    const value = button.getAttribute("data-value");
    const cartId = button.getAttribute("data-cartid");
    const productId = button.getAttribute("data-productid");

   
    
    fetch('/home/cart/changeQuantity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({value,cartId,productId})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
       
           window.location.href='/home/cart'
         
    
        } else{
         
            quantityError.innerText=data.message
            setTimeout(()=>{
                quantityError.innerText=""
            },2000)
        }
    })
    .catch(error => {
        console.error('Error while changing password:', error);
    });




  });
});
