const showPaymentOption = () => {
  closeWallet()
  document.getElementById("CODform").style.display = "none";
  document.getElementById("paymentForm").style.display = "block";
}

const showCOD = () => {
  closeWallet()
  document.getElementById("paymentForm").style.display = "none";
  document.getElementById("CODform").style.display = "block";
}





const openCODconfirm = () => {
  document.getElementById("CODconfirm").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

const closeCODconfirm = () => {
  document.getElementById("CODconfirm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}


const showWallet=()=>{
  document.getElementById("CODform").style.display = "none";
  document.getElementById("paymentForm").style.display = "none";
  document.getElementById("walletForm").style.display = "block";

}

const closeWallet=()=>{
  document.getElementById("walletForm").style.display = "none";

}