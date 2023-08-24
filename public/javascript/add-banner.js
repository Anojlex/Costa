
    document.addEventListener("DOMContentLoaded", () => {
        const fileInput = document.getElementById("bannerImage");
        const previewContainer = document.querySelector(".preview-container");
        const selectedImages = new Set();

        fileInput.addEventListener("change", (event) => {
            previewContainer.innerHTML = ""; // Clear previous previews
            selectedImages.clear();

            const files = event.target.files;
            for (const file of files) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const img = document.createElement("img");
                    img.src = event.target.result;
                    img.alt = "Preview";
                    img.classList.add("preview-image");

                    img.addEventListener("click", () => {
                        if (selectedImages.has(file)) {
                            selectedImages.delete(file);
                            img.classList.remove("selected");
                        } else {
                            selectedImages.add(file);
                            img.classList.add("selected");
                        }
                    });

                    previewContainer.appendChild(img);
                };

                reader.readAsDataURL(file);
            }
        });

        const clearSelectionBtn = document.getElementById("clearSelectionBtn");
        clearSelectionBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the form from being submitted
            previewContainer.querySelectorAll("img").forEach((img) => {
                img.classList.remove("selected");
            });
            selectedImages.clear();
        });
    });
