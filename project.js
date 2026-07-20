const projects = [
  {
    title: "KVD Property Investment",
    link: "https://kvdpropertyinvestment.com/",
    image: "images/kvd.png",
    description:
      "A real estate platform combining a modern listing website with a custom Property Management System, delivering seamless UX and efficient backend control.",
  },
  {
    title: "Three09 Events",
    link: "http://three09events.com",
    image: "images/three09-events.png",
    description:
      "A custom website developed for an event planning company, featuring immersive visuals, service showcases, event galleries, and a polished, responsive digital experience.",
  },
  {
    title: "Golden Chidi - Realtor",
    link: "http://golden-chidi.vercel.app/",
    image: "images/Golden-chidi.png",
    description:
      "A responsive real estate website for Golden Chidi, featuring property listings and training programs. Developed as a portfolio project.",
  },
  {
    title: "Bright Future Academy",
    link: "https://bright-future-academy-andrew.vercel.app/",
    image: "images/bright-future.png",
    description:
      "School website delivering smooth and informative user experience, with a structured layout for showcasing academic programs, admissions, and key school information.",
  },
];

const INITIAL_VISIBLE = 3;

function createProjectCard(project, index) {
  const a = document.createElement("a");
  a.href = project.link;
  a.target = "_blank";
  a.rel = "noopener";
  a.className = "projectBox card reveal reveal-up";

  if (index >= INITIAL_VISIBLE) {
    a.classList.add("extra-project", "is-hidden");
  }

  a.innerHTML = `
    <img src="${project.image}" alt="Projects" class="projectPic" />
    <div class="card-text">
      <span class="stars"></span>
      <h4>${project.title}</h4>
      <p>
        ${project.description}
        <strong>View live site</strong>
      </p>
    </div>
  `;

  return a;
}

function renderProjects() {
  const projectRow = document.getElementById("projectRow");
  if (!projectRow) return;

  const fragment = document.createDocumentFragment();
  projects.forEach((project, index) => {
    fragment.appendChild(createProjectCard(project, index));
  });
  projectRow.appendChild(fragment);

  // Hook the newly created cards into the scroll reveal system
  if (window.revealObserver) {
    projectRow
      .querySelectorAll(".reveal")
      .forEach((el) => window.revealObserver.observe(el));
  }

  setupViewMoreButton();
}

function setupViewMoreButton() {
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  if (!viewMoreBtn) return;

  if (projects.length <= INITIAL_VISIBLE) {
    viewMoreBtn.style.display = "none";
    return;
  }

  viewMoreBtn.addEventListener("click", function () {
    document
      .querySelectorAll(".extra-project.is-hidden")
      .forEach(function (card) {
        card.classList.remove("is-hidden");
      });
    viewMoreBtn.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", renderProjects);
