// ==========================================
// SMBC PDF Engine v4.2
// Chunk 1
// ==========================================

"use strict";

window.PDFEngine = {

    // --------------------------------------
    // PDF Settings
    // --------------------------------------

    pageWidth: 210,
    pageHeight: 297,

    columns: 4,
    rows: 3,
    blocksPerPage: 12,

    margin: 5,
    gap: 3,

    // --------------------------------------
    // DOM References
    // --------------------------------------

    getResultArea() {
        return document.getElementById("resultArea");
    },

    // --------------------------------------
    // Scan Result Sections
    //
    // Reads:
    // H2
    // PairBlocks
    //
    // Produces:
    // [
    //   {
    //      title:"SD 05",
    //      blocks:[...]
    //   }
    // ]
    // --------------------------------------

    collectSections() {

        const result = [];
        const area = this.getResultArea();

        if (!area) return result;

        let current = null;

        [...area.children].forEach(node => {

            if (node.tagName === "H2") {

                current = {
                    title: node.textContent.trim(),
                    blocks: []
                };

                result.push(current);
                return;
            }

            if (
                current &&
                node.classList &&
                node.classList.contains("pairBlock")
            ) {

                current.blocks.push(node);

            }

        });

        return result;

    },

    // --------------------------------------
    // Split one section
    // into pages of 12 blocks
    // --------------------------------------

    paginateSection(section) {

        const pages = [];

        for (
            let i = 0;
            i < section.blocks.length;
            i += this.blocksPerPage
        ) {

            pages.push({

                title: section.title,

                blocks: section.blocks.slice(
                    i,
                    i + this.blocksPerPage
                )

            });

        }

        // Empty section safety

        if (pages.length === 0) {

            pages.push({

                title: section.title,

                blocks: []

            });

        }

        return pages;

    },

    // --------------------------------------
    // Create one printable PDF page
    // --------------------------------------

    createPage(pageData) {

        const page = document.createElement("div");
        page.className = "pdfPage";

        const title = document.createElement("div");

        title.style.fontSize = "18px";
        title.style.fontWeight = "bold";
        title.style.textAlign = "center";
        title.style.marginBottom = "4mm";
        title.textContent = pageData.title;

        page.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "pdfGrid";

        page.appendChild(grid);

        // Fill the 12 grid cells.
        // Blank cells remain empty.

        for (let i = 0; i < this.blocksPerPage; i++) {

            if (i < pageData.blocks.length) {

                const clone = pageData.blocks[i].cloneNode(true);

                clone.style.margin = "0";

                grid.appendChild(clone);

            } else {

                const blank = document.createElement("div");

                blank.style.border = "1px solid transparent";
                blank.style.width = "100%";
                blank.style.height = "100%";
                blank.style.boxSizing = "border-box";

                grid.appendChild(blank);

            }

        }

        return page;

    },

    // --------------------------------------
    // Create hidden rendering container
    // --------------------------------------

    createHiddenContainer() {

        const container = document.createElement("div");

        container.id = "__smbc_pdf_container";

        container.style.position = "fixed";
        container.style.left = "-100000px";
        container.style.top = "0";
        container.style.width = "210mm";
        container.style.background = "#ffffff";
        container.style.zIndex = "-1";

        document.body.appendChild(container);

        return container;

    },

    // --------------------------------------
    // Remove hidden container
    // --------------------------------------

    removeHiddenContainer(container) {

        if (
            container &&
            container.parentNode
        ) {

            container.parentNode.removeChild(container);

        }

    },

    // --------------------------------------
    // Render pages into jsPDF
    // --------------------------------------

    async renderPDF(printPages) {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true

        });

        const container = this.createHiddenContainer();

        try {

            for (let i = 0; i < printPages.length; i++) {

                const page = printPages[i];

                container.innerHTML = "";
                container.appendChild(page);

                // Allow layout to settle before capture
                await new Promise(resolve => requestAnimationFrame(resolve));

                const canvas = await html2canvas(page, {

                    scale: 2,
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    logging: false

                });

                const imgData = canvas.toDataURL("image/jpeg", 0.95);

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

        } finally {

            this.removeHiddenContainer(container);

        }

        pdf.save("SMBC.pdf");

    },

    // --------------------------------------
    // Export Entry Point
    // (Preserved for script.js)
    // --------------------------------------

    async export() {

        const sections = this.collectSections();

        if (!sections.length) {

            alert("Please calculate SMBC first.");
            return;

        }

        const printPages = [];

        sections.forEach(section => {

            const pages = this.paginateSection(section);

            pages.forEach(page => {

                printPages.push(
                    this.createPage(page)
                );

            });

        });

        await this.renderPDF(printPages);

    }

};
