document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const slider = document.querySelector("[data-slider]");

  if (slider) {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    };

    if (slides.length > 0) {
      showSlide(currentIndex);

      nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });

      prevBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });

      setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      }, 5000);
    }
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          const categories = card.dataset.category || "";

          if (filter === "all" || categories.includes(filter)) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  const quoteForm = document.getElementById("quoteForm");

  if (quoteForm) {
    const successMessage = document.getElementById("formSuccess");

    const validators = {
      nombre: (value) => value.trim().length >= 3 || "Ingresa un nombre válido.",
      telefono: (value) => value.trim().length >= 7 || "Ingresa un teléfono válido.",
      correo: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Ingresa un correo válido.",
      "tipo-porton": (value) => value.trim() !== "" || "Selecciona una opción.",
      ubicacion: (value) => value.trim().length >= 3 || "Ingresa una ubicación válida.",
      mensaje: (value) => value.trim().length >= 10 || "Describe mejor tu proyecto.",
    };

    const showError = (input, message) => {
      input.classList.add("input-error");
      const errorBox = input.parentElement.querySelector(".error-message");
      if (errorBox) errorBox.textContent = message;
    };

    const clearError = (input) => {
      input.classList.remove("input-error");
      const errorBox = input.parentElement.querySelector(".error-message");
      if (errorBox) errorBox.textContent = "";
    };

    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach((fieldName) => {
        const input = quoteForm.elements[fieldName];
        if (!input) return;

        const result = validators[fieldName](input.value);

        if (result !== true) {
          isValid = false;
          showError(input, result);
        } else {
          clearError(input);
        }
      });

      if (!isValid) {
        if (successMessage) successMessage.textContent = "";
        return;
      }

      quoteForm.reset();

      if (successMessage) {
        successMessage.textContent =
          "Tu solicitud fue validada correctamente. Ya puedes conectar este formulario con EmailJS, Formspree o un backend.";
      }
    });

    Array.from(quoteForm.elements).forEach((field) => {
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.addEventListener("input", () => clearError(field));
        field.addEventListener("change", () => clearError(field));
      }
    });
  }
});