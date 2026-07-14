// ==========================================
// SMBC PDF Engine v4.1
// Chunk 1
// ==========================================

"use strict";

window.PDFEngine = {

    pageWidth: 210,
    pageHeight: 297,

    columns: 4,
    rows: 3,

    blocksPerPage: 12,

    margin: 5,

    fileName: "SMBC_Calculation.pdf",

    // --------------------------------------
    // Collect headings and pair blocks
    // --------------------------------------

    getContent() {

        const result = document.getElementById("resultArea");

        const items = [];

        let currentTitle = "";

        [...result.children].forEach(node => {

            if (node.tagName === "H2") {

                currentTitle = node.textContent.trim();

                return;

            }

            if (node.classList.contains("pairBlock")) {

                items.push({

                    title: currentTitle,

                    block: node

                });

            }

        });

        return items;

    },

    // --------------------------------------
    // Split into pages
    // --------------------------------------

    splitIntoPages(items) {

        const pages = [];

        for (let i = 0; i < items.length; i += this.blocksPerPage) {

            pages.push(

                items.slice(i, i + this.blocksPerPage)

            );

        }

        return pages;

    },

    // --------------------------------------
    // Hidden rendering container
    // --------------------------------------

    createContainer() {

        const old = document.getElementById("pdfRenderContainer");

        if (old) old.remove();

        const container = document.createElement("div");

        container.id = "pdfRenderContainer";

        container.style.position = "absolute";
        container.style.left = "-100000px";
        container.style.top = "0";
        container.style.width = "210mm";
        container.style.background = "#ffffff";

        document.body.appendChild(container);

        return container;

    },

    removeContainer(container) {

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

            group.forEach(item => {

                const clone = item.block.cloneNode(true);

                clone.style.margin = "0";
                clone.style.width = "100%";
                clone.style.height = "100%";
                clone.style.boxSizing = "border-box";
                clone.style.display = "flex";
                clone.style.flexDirection = "column";

                if (item.title) {

                    const heading = document.createElement("div");

                    heading.textContent = item.title;

                    heading.style.fontSize = "16px";
                    heading.style.fontWeight = "bold";
                    heading.style.textAlign = "center";
                    heading.style.marginBottom = "6px";
                    heading.style.borderBottom = "1px solid #999";
                    heading.style.paddingBottom = "4px";

                    clone.insertBefore(
                        heading,
                        clone.firstChild
                    );

                }

                grid.appendChild(clone);

            });

            container.appendChild(page);

            pages.push(page);

        });

        return pages;

    },

    // --------------------------------------
    // Render Page
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
    // Create jsPDF
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

        const items = this.getContent();

        if (items.length === 0) {

            alert("Please calculate SMBC first.");

            return;

        }

        const container = this.createContainer();

        try {

            const pageGroups = this.splitIntoPages(items);

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

        } catch (err) {

            console.error(err);

            alert("PDF generation failed:\n\n" + err.message);

        } finally {

            this.removeContainer(container);

        }

    }

};
