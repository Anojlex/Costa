var fileInput = document.getElementById('image');

fileInput.addEventListener('change', function(event) {
  var files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    var file = files[i];
    var reader = new FileReader();

    reader.onload = function(e) {
      var uploadPreview = document.querySelector('.upload-preview-' + (i + 1));
      var img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Product Image';

      uploadPreview.innerHTML = '';
      uploadPreview.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
});
