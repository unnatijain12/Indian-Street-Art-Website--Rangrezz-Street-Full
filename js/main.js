// Number count animation on scroll for info cards
const numbers = document.querySelectorAll('.number');
let counted = false;

function countUp() {
    const section = document.querySelector('.coverage');
    if (!section) return;

    const trigger = section.getBoundingClientRect().top;

    if (!counted && trigger < window.innerHeight - 100) {

        numbers.forEach(num => {
            const target = +num.dataset.target;
            let count = 0;

            const speed = 40; // HIGHER = SLOWER

            const interval = setInterval(() => {

                count += Math.ceil(target / speed);

                if (count >= target) {
                    num.innerText = target + "+";
                    clearInterval(interval);
                } else {
                    num.innerText = count + "+";
                }

            }, 40); // interval timing (increase for slower)
        });

        counted = true;
    }
}

window.addEventListener("scroll", countUp);
window.addEventListener("load", countUp);
// CITIES TABS
// ===============================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// ===============================
// STYLE CARD FADE-IN
// ===============================

const styleCards = document.querySelectorAll(".style-card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.2 });

styleCards.forEach(card => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s ease";
  observer.observe(card);
});

// Subtle scroll reveal animation

const themeCards = document.querySelectorAll('.theme-card');

const revealOnScroll = () => {
    themeCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
};

themeCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "all 0.6s ease";
});

window.addEventListener('scroll', revealOnScroll);

// Scroll reveal animation

const cards = document.querySelectorAll('.folk-card');

cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "all 0.6s ease";
});

const reveal = () => {
    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
};

window.addEventListener("scroll", reveal);

// Scroll reveal for cards and comparison columns

const elements = document.querySelectorAll('.card, .column');

elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.6s ease";
});

const revealElements = () => {
    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};
window.addEventListener("scroll", revealElements);


// Event Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const eventCards = document.querySelectorAll(".event-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        eventCards.forEach(card => {
            if (filter === "all" || card.getAttribute("data-category") === filter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// ===============================
// CONTACT FORM — sends to backend
// ===============================

const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                alert("Thank you for your message! We will respond within 48 hours.");
                form.reset();
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Could not connect to server. Please try again later.");
        }
    });
}
