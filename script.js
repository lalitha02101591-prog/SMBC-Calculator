// ==========================================
// SMBC Calculator v1.0
// Dynamic UI Generator
// ==========================================

const titles = [
    "SD",
    "SN",
    "MD",
    "MN",
    "RJD",
    "RJN",
    "KD",
    "KN",
    "TB",
    "NTB",
    "MBZ"
];

const subtitles = [
    "05",
    "16",
    "27",
    "38",
    "49"
];

const inputArea = document.getElementById("inputArea");
const resultArea = document.getElementById("resultArea");

// Create all sections
titles.forEach(title => {

    const section = document.createElement("div");
    section.className = "section";

    const header = document.createElement("div");
    header.className = "sectionHeader";
    header.textContent = title;

    const body = document.createElement("div");
    body.className = "sectionBody";

    subtitles.forEach(sub => {

        const block = document.createElement("div");
        block.className = "subtitleBlock";

        const label = document.createElement("label");
        label.textContent = `${title} ${sub}`;

        const textarea = document.createElement("textarea");
        textarea.id = `${title}_${sub}`;
        textarea.placeholder = "Example: 25,40,51,90";

        block.appendChild(label);
        block.appendChild(textarea);

        body.appendChild(block);

    });

    header.addEventListener("click", () => {

        body.style.display =
            body.style.display === "block"
            ? "none"
            : "block";

    });

    section.appendChild(header);
    section.appendChild(body);

    inputArea.appendChild(section);

});

// Calculate button
document
.getElementById("calculateBtn")
.addEventListener("click", () => {

    alert("SMBC Calculation Engine will be added in the next version.");

});

// Clear button
document
.getElementById("clearBtn")
.addEventListener("click", () => {

    document
        .querySelectorAll("textarea")
        .forEach(box => box.value = "");

    resultArea.innerHTML = "";

});
