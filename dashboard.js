const collegeSections = document.querySelectorAll(".college-section");

collegeSections.forEach((section) => {
  const header = section.querySelector("h3");
  const programs = section.querySelector(".extension-programs");

  header.addEventListener("click", () => {
    programs.classList.toggle("active");
    header.classList.toggle("active"); // Optional: Add a visual indicator
  });
});

const headings = document.querySelectorAll("a");

headings.forEach((heading) => {
  heading.addEventListener("click", () => {
    // Remove any existing pop-up
    const existingPopup = document.querySelector(".popup");
    if (existingPopup) {
      existingPopup.remove();
    }

    const targetSectionId = heading.getAttribute("data-target");
    const targetSection = document.getElementById(targetSectionId);

    // Create a new pop-up table
    const popup = document.createElement("div");
    popup.classList.add("popup");

    const table = document.createElement("table");
    popup.appendChild(table);

    // Extract table rows from the target section
    const rows = targetSection.querySelectorAll("tr");
    rows.forEach((row) => {
      const newRow = table.insertRow();
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell.textContent;

        // Add bold formatting to th cells
        if (cell.tagName === "TH") {
          newCell.style.fontWeight = "bold";
        }
      });
    });

    // Add close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.textContent = "Exit";
    closeButton.addEventListener("click", () => {
      popup.remove();
    });
    popup.appendChild(closeButton);

    // Add "Show on Map" button
    const showOnMapButton = document.createElement("button");
    showOnMapButton.classList.add("show-on-map-button"); // Add a class for styling
    showOnMapButton.textContent = "Open Project";

    // Implement your desired functionality for the "Show on Map" button here
    // (e.g., open a map with relevant location information)
    showOnMapButton.addEventListener("click", () => {
      // Your map functionality logic goes here
    });
    popup.appendChild(showOnMapButton);

    document.body.appendChild(popup);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "A" && target.dataset.target) {
    const sectionId = target.dataset.target;
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
    event.preventDefault(); // Prevent default link behavior
  }
});
