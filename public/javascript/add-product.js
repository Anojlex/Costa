const imageInput = document.getElementById('image');
const uploadPreviews = document.querySelectorAll('.upload-preview');

imageInput.addEventListener('change', (e) => {
  const files = e.target.files;
  Array.from(files).forEach((file, index) => {
    if (index < uploadPreviews.length) {
      const reader = new FileReader();

      reader.onload = (event) => {
        uploadPreviews[index].innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };

      reader.readAsDataURL(file);
    }
  });   
});

// Drag and drop functionality
uploadPreviews.forEach((preview) => {
  preview.addEventListener('dragover', (e) => {
    e.preventDefault();
    preview.classList.add('dragover');
  });

  preview.addEventListener('dragleave', () => {
    preview.classList.remove('dragover');
  });

  preview.addEventListener('drop', (e) => {
    e.preventDefault();
    preview.classList.remove('dragover');
    const file = e.dataTransfer.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
    };

    reader.readAsDataURL(file);
  });
});
