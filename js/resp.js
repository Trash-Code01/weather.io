document.addEventListener("DOMContentLoaded", () => {
    
    const menuBtn = document.getElementById("hamburger");
    const navLinks = document.getElementById('navp2');
    const nav = document.getElementById("nav");
    const logo = document.getElementById("logo");

    let value = 0;

    menuBtn.addEventListener('click', () => {
        if (value === 0) {
            navLinks.style.display = 'none';
            logo.style.display = 'none';
            nav.style.height = "0px";
            value = 1;
        } else {
            navLinks.style.display = 'flex';
            logo.style.display = 'flex';
            nav.style.height = "330px";
            value = 0;
        }
    });
});
