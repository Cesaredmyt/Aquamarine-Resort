document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.event-button').forEach(button => {
        button.addEventListener('click', () => {
            alert('¡Te contactaremos con más información sobre el evento!');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const container = document.querySelector(".rooms-container");

    prevBtn.addEventListener("click", () => {
        container.scrollBy({ left: -320, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
        container.scrollBy({ left: 320, behavior: "smooth" });
    });
});
