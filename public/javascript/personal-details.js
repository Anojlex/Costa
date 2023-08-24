// Function to open the email form
function openEmailForm() {
  document.getElementById("emailForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the email form
function closeEmailForm() {
  document.getElementById("emailForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Function to open the password form
function openPasswordForm() {
  document.getElementById("pwdForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the password form
function closePasswordForm() {
  document.getElementById("pwdForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}



// Function to open the verify form
function openForgotPwdOtpForm() {
  document.getElementById("pwdForm").style.display = "none";
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



// Function to open the phone form
function openPhoneForm() {
  document.getElementById("phoneForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the phone form
function closePhoneForm() {
  document.getElementById("phoneForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Function to open the OTP form
function openotpForm() {
  document.getElementById("phoneForm").style.display = "none";
  document.getElementById("otpForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the OTP form
function closeOtpForm() {
  document.getElementById("otpForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}




const changeEmail = () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const changeSuccess = document.getElementById("changeSuccess");

  emailError.textContent = "";
  passwordError.textContent = "";

  const emailRegex = /^\S+@\S+\.\S+$/;
  const isValidEmail = emailRegex.test(emailInput.value);
  const isValidPassword = passwordInput.value.length >= 6;

  if (!isValidEmail) {
    emailError.textContent = "Invalid email address";
  }

  if (!isValidPassword) {
    passwordError.textContent = "Invalid Password (min 6 characters)";
  }

  if (isValidEmail && isValidPassword) {
    fetch('/user/profile/personalInfo/changeEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newmail: emailInput.value, curPassword: passwordInput.value })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show success message or handle success case
        changeSuccess.textContent = "Password changed successfully";
      
        setTimeout(() => {
          location.reload();
        }, 1500); // Reload after 2 s
      } else {
        // Show error message or handle failure case
        passwordError.textContent = data.message;
      }
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".changeEmail");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    changeEmail();
  });
});



// Change Password form validation and submission
const changePwd = () => {
  const currentInput = document.getElementById("current");
  const newInput = document.getElementById("new");
  const confirmInput = document.getElementById("confirm");
  const currentError = document.getElementById("current-error");
  const newError = document.getElementById("new-error");
  const confirmError = document.getElementById("confirm-error");
  const changePwdSuccess = document.getElementById("changePwdSuccess");


  currentError.textContent = "";
  newError.textContent = "";
  confirmError.textContent = "";

  let isValid = true;

  if (currentInput.value.length < 6) {
    currentError.textContent = "Password must be at least 6 characters";
    isValid = false;
  }

  if (newInput.value.length < 6) {
    newError.textContent = "Password must be at least 6 characters";
    isValid = false;
  }

  if (confirmInput.value !== newInput.value) {
    confirmError.textContent = "Passwords do not match";
    isValid = false;
  }

  if (isValid) {
    fetch("/user/profile/personalInfo/changePwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPwd: currentInput.value,
        newPwd: newInput.value,
        confirmPwd: confirmInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
         
          changePwdSuccess.textContent =  data.message;
          setTimeout(() => {
            location.reload();
          }, 1500); 
        } else {
         
          currentError.textContent = data.message;
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".changePassword");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    changePwd();
  });
});



// Function to send OTP when "Forgot Password?" is clicked

function sendForgotPwdOTP() {
  fetch('/user/profile/personalInfo/forgotPwd/sendOtp', {
      method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          openForgotPwdOtpForm();
      }else{
        currentError.textContent = "Failed to send OTP ";      
      }
  })
  .catch(error => {
      console.error('Error while sending OTP:', error);
  });
}


// Function to send the entered OTP to the server for verification
function verifyOtp() {
  const otp = document.getElementById('otpInput').value;
 let isValid=true

  if(otp.length<6){
    document.getElementById('otp-error').textContent = 'Invalid OTP';
    isValid=false
  }
if(isValid){
  fetch('/user/profile/personalInfo/forgotPwd/verifyOtp', {
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

      fetch('/user/profile/personalInfo/forgotPwd/updatePwd', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newPassword, confirmPassword })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
        
              document.getElementById('changePwdSuccessp').textContent = 'Password changed successfully.';
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


const newNumSendOtp=()=>{
  const phoneInput=document.getElementById('newPhone').value;
  const newPhoneError=document.getElementById('newPhoneError')

 let isValid=true;
 if(phoneInput.length<10){

  newPhoneError.textContent="Enter a valid Phone Number"
  isValid=false
 }

if(isValid){
  const mobile=document.getElementById('newPhone').value;

  fetch('/user/profile/personalInfo/changeNum/newNumSendOtp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({mobile})
})
.then(response => response.json())
.then(data => {
    if (data.success) {
      openotpForm()
    } else {
    
      newPhoneError.textContent = 'Failed to Send Otp.Try again';
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




const verifyChangePhoneOtp=()=>{
  const otpInput=document.getElementById('changePhoneOtp').value;
  const newPhoneOtpError=document.getElementById('newPhoneOtpError')


 let isValid=true;
 if(otpInput.length<6){
  newPhoneOtpError.textContent="Enter valid OTP"
  isValid=false;
 }
if(isValid){
  const otp=document.getElementById('changePhoneOtp').value;


  fetch('/user/profile/personalInfo/changeNum/verifyChangePhoneOtp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({otp})
})
.then(response => response.json())
.then(data => {
    if (data.success) {
    changePhoneSuccess.textContent="Phone Changed Successfully"
    setTimeout(() => {
      location.reload();
    }, 1500); 

    } else {
    
      newPhoneOtpError.textContent = 'Invalid OTP.Try again';
    }
})
.catch(error => {
    console.error('Error while changing password:', error);
});
}
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".verifyChangePhoneOtp");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    verifyChangePhoneOtp();
  });
});