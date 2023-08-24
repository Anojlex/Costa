

const openCancelOrderCod = (form) => {
  

  document.getElementById("cancelOrderPopupCod").style.display = "block";
  document.getElementById("overlay").style.display = "block";
};

const closeCancelOrderCod = () => {
 
  document.getElementById("cancelOrderPopupCod").style.display = "none";
  document.getElementById("overlay").style.display = "none";
};

 

  const openCancelOrder = () => {
  

    document.getElementById("cancelOrderPopup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  };

  const closeCancelOrder = () => {
   
    document.getElementById("cancelOrderPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  };



const openmodeOfRefundPopup=()=>{
  document.getElementById("cancelOrderPopup").style.display = "none";
  document.getElementById("modeOfRefundPopup").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

const closemodeOfRefundPopup=()=>{

  document.getElementById("modeOfRefundPopup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}







