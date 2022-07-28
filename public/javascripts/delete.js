const moreBtns = document.querySelectorAll('.more-btn');

moreBtns.forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.nextSibling.style.display = "block";
    })

    btn.nextSibling.addEventListener("mouseout", () => {
        btn.nextSibling.style.display = "none";
    })
})