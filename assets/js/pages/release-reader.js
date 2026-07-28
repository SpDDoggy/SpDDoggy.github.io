const sectionLinks = [...document.querySelectorAll(".release-toc a[href^='#']")];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setCurrentSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (observedSections.length) {
  const initialSection = window.location.hash.slice(1);
  setCurrentSection(
    observedSections.some((section) => section.id === initialSection)
      ? initialSection
      : observedSections[0].id
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];

      if (visibleEntry) {
        setCurrentSection(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-18% 0px -68% 0px",
      threshold: 0
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
