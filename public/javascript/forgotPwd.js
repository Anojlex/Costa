

// Function to open the verify form
function openForgotPwdOtpForm() {
  document.getElementById("phoneForm").style.display = "none";
    document.getElementById("OtpVerify").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  }
  
  // Function to close the verify form
  function closeForgotPwdOtpForm() {
    document.getElementById("OtpVerify").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }


// Function to open the change password form after otp verification
function openChangePwd() {
    document.getElementById("OtpVerify").style.display = "none";
    document.getElementById("ChangePwd").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  }
  
  // Function to close the change password form
  function closeChangePwd() {
    document.getElementById("ChangePwd").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }
  
  

function openPhoneForm() {
  document.getElementById("phoneForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

//====Function to close the phone form==//
function closePhoneForm() {
  document.getElementById("phoneForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}



  
const UserNumSendOtp=()=>{
  const phoneInput=document.getElementById('newPhone').value;
  const newPhoneError=document.getElementById('newPhoneError')

 let isValid=true;
 if(phoneInput.length<10){

  newPhoneError.textContent="Enter a valid Phone Number"
  isValid=false
 }

if(isValid){
  const mobile=document.getElementById('newPhone').value;

  fetch('/user/userForgotPassword', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({mobile})
})
.then(response => response.json())
.then(data => {
    if (data.success) {
      openForgotPwdOtpForm()
    } else {
    
      newPhoneError.textContent = data.message
    }
})
.catch(error => {
    console.error('Error while changing password:', error);
});

}
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".newNumSendOtp");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    newNumSendOtp();
  });
});


  
  // Function to send the entered OTP to the server for verification
  function verifyOtp() {
    const otp = document.getElementById('otpInput').value;
   let isValid=true
  
    if(otp.length<6){
      document.getElementById('otp-error').textContent = 'Invalid OTP';
      isValid=false
    }
  if(isValid){
    fetch('/user/verifyOtpUserForgot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           
            openChangePwd();
        } else {
            
            document.getElementById('otp-error').textContent = 'Incorrect OTP, please try again.';
        }
    })
    .catch(error => {
        console.error('Error while verifying OTP:', error);
    });
  }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector(".forgotOtp");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      verifyOtp();
    });
  });
  
  
  
  // Function to validate the change password form
  const updateForgotPwd=()=>{
  
  
    const newPassword = document.getElementById('newp').value;
    const confirmPassword = document.getElementById('confirmp').value;
    const newPasswordError = document.getElementById('newp-error');
    const confirmPwdError = document.getElementById('confirmp-error');
  
    newPasswordError.textContent = '';
    confirmPwdError.textContent = '';
  
  let isValid=true
    if (newPassword.trim().length<6) {
        newPasswordError.textContent = 'Please enter a valid password.';
        isValid=false
    } 
  
    if (confirmPassword.trim().length<6) {
        confirmPwdError.textContent = 'Please confirm the password.';
        isValid=false
    } 
     if (newPassword !== confirmPassword) {
        confirmPwdError.textContent = 'Passwords do not match.';
        isValid=false
    } 
  
    if (isValid) {
        const newPassword = document.getElementById('newp').value;
        const confirmPassword = document.getElementById('confirmp').value;
  
        fetch('/user/updateUserForgotPwd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword, confirmPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
          
                document.getElementById('changePwdSuccessp').textContent = 'Password changed successfully.Login Now';
                setTimeout(() => {
                  location.reload();
                }, 1500); 
            } else {
            
              confirmPwdError.textContent = 'Failed to change password.';
            }
        })
        .catch(error => {
            console.error('Error while changing password:', error);
        });
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector(".updateForgotPwd");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      updateForgotPwd();
    });
  });
  
