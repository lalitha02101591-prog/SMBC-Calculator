// ==========================================
// SMBC PDF Engine v4.0
// Chunk 1
// ==========================================

"use strict";

window.PDFEngine = {

    // --------------------------------------
    // Page Configuration
    // --------------------------------------

    pageWidth: 210,
    pageHeight: 297,

    columns: 4,
    rows: 3,

    blocksPerPage: 12,

    margin: 5,

    fileName: "SMBC_Calculation.pdf",

    // --------------------------------------
    // Get Result Blocks
    // --------------------------------------

    getBlocks() {

        return Array.from(
            document.querySelectorAll("#resultArea .pairBlock")
        );

    },

    // --------------------------------------
    // Split Blocks Into Pages
    // --------------------------------------

    splitIntoPages(blocks) {

        const pages = [];

        for (let i = 0; i < blocks.length; i += this.blocksPerPage) {

            pages.push(
                blocks.slice(i, i + this.blocksPerPage)
            );

        }

        return pages;

    },

    // --------------------------------------
    // Hidden Print Container
    // --------------------------------------

    createHiddenContainer() {

        const old = document.getElementById("pdfRenderContainer");

        if (old) {
            old.remove();
        }

        const container = document.createElement("div");

        container.id = "pdfRenderContainer";

        container.style.position = "absolute";
        container.style.left = "-100000px";
        container.style.top = "0";
        container.style.width = "210mm";
        container.style.background = "#ffffff";
        container.style.zIndex = "-1";

        document.body.appendChild(container);

        return container;

    },

    // --------------------------------------
    // Remove Hidden Container
    // --------------------------------------

    removeHiddenContainer(container) {

        if (container && container.parentNode) {

            container.parentNode.removeChild(container);

        }

    },

        // --------------------------------------
    // Build Printable Pages
    // --------------------------------------

    buildPages(pageGroups, container) {

        const pages = [];

        pageGroups.forEach(group => {

            const page = document.createElement("div");
            page.className = "pdfPage";

            const grid = document.createElement("div");
            grid.className = "pdfGrid";

            page.appendChild(grid);

            group.forEach(block => {


const clone = block.cloneNode(true);

clone.style.margin = "0";
clone.style.width = "100%";
clone.style.height = "100%";
clone.style.boxSizing = "border-box";

// --------------------------------------
// Copy section title (SD 05, SD 16, etc.)
// --------------------------------------

const prev = block.previousElementSibling;

if (prev && prev.tagName === "H2") {

    const title = document.createElement("div");

    title.textContent = prev.textContent;

    title.style.fontSize = "16pt";
    title.style.fontWeight = "bold";
    title.style.textAlign = "center";
    title.style.marginBottom = "8px";

    clone.insertBefore(title, clone.firstChild);

}

grid.appendChild(clone);
                
});

            container.appendChild(page);

            pages.push(page);

        });

        return pages;

    },

    // --------------------------------------
    // Render One Page
    // --------------------------------------

    async renderPage(page) {

        return await html2canvas(page, {

            backgroundColor: "#ffffff",

            scale: 2,

            useCORS: true,

            logging: false

        });

    },

    // --------------------------------------
    // Create jsPDF Instance
    // --------------------------------------

    createPDF() {

        return new jspdf.jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4",

            compress: true

        });

    },

        // --------------------------------------
    // Export PDF
    // --------------------------------------

    async export() {

        const blocks = this.getBlocks();

        if (blocks.length === 0) {

            alert("Please calculate SMBC first.");

            return;

        }

        const container = this.createHiddenContainer();

        try {

            const pageGroups = this.splitIntoPages(blocks);

            const pages = this.buildPages(pageGroups, container);

            const pdf = this.createPDF();

            for (let i = 0; i < pages.length; i++) {

                const canvas = await this.renderPage(pages[i]);

                const imgData = canvas.toDataURL("image/jpeg", 1.0);

                if (i > 0) {

                    pdf.addPage();

                }

                pdf.addImage(
                    imgData,
                    "JPEG",
                    0,
                    0,
                    this.pageWidth,
                    this.pageHeight
                );

            }

            pdf.save(this.fileName);

        } finally {

            this.removeHiddenContainer(container);

        }

    }

};
