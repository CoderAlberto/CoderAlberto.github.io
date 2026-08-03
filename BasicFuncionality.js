
  const btn = document.getElementById("toggleBtn");
  const extras = document.querySelectorAll(".extra");
  const projectsSection = document.querySelector(".projects");

  let abierto = false;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    abierto = !abierto;

    // mostrar / ocultar extras
    extras.forEach((el) => {
      el.style.display = abierto ? "flex" : "none";
    });
    

    // cambiar texto botón
    btn.textContent = abierto ? "Ver menos ↑" : "Ver todos →";
  });

  // redirección
  function goTo(url) {
    window.open(url, "_blank");
  }
