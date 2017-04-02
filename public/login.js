//Fade in dashboard box
$(document).ready(function () {
  $('.box').hide().fadeIn(1000);
});


var email, password;

document.getElementById('btn-signin').onclick = function () {
  email = document.getElementById('input-email').value;
  password = document.getElementById('input-password').value;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
    console.log('Success for sign in');
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
};

document.getElementById('btn-signup').onclick = function () {
  email = document.getElementById('input-email').value;
  password = document.getElementById('input-password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (result) {
    console.log('Success for sign up');
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    location.href = "/dashboard"
  }
});