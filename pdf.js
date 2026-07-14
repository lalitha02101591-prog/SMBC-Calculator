// ==========================================
// SMBC PDF Engine v3.1
// Part 1
// ==========================================


"use strict";


window.PDFEngine = {

    pageWidth: 210,
    pageHeight: 297,

    columns: 4,
    rows: 3,

    blocksPerPage: 12,

    margin: 5,

    getBlocks() {
        return [...document.querySelectorAll(".pairBlock")];
    },

    splitIntoPages(blocks) {

        const pages = [];

        for (let i = 0; i < blocks.length; i += this.blocksPerPage) {

            pages.push(
                blocks.slice(i, i + this.blocksPerPage)
            );

        }

        return pages;

    },

    createHiddenContainer() {

        const container = document.createElement("div");

        container.id = "pdfContainer";

        container.style.position = "fixed";
        container.style.left = "-10000px";
        container.style.top = "0";
        container.style.background = "#ffffff";

        document.body.appendChild(container);

        return container;

    },

    removeHiddenContainer() {

        const node = document.getElementById("pdfContainer");

        if (node) {

            node.remove();

        }

    }

};

console.log("SMBC PDF Engine v3.1 loaded");

// ==========================================
// PDF Engine v3.1
// Part 2
// ==========================================

PDFEngine.renderPages = function () {

    this.removeHiddenContainer();

    const container = this.createHiddenContainer();

    const pages = this.splitIntoPages(
        this.getBlocks()
    );

    pages.forEach(pageBlocks => {

        const page = document.createElement("div");
        page.className = "pdfPage";

        const grid = document.createElement("div");
        grid.className = "pdfGrid";

        page.appendChild(grid);

        pageBlocks.forEach(block => {

            const copy = block.cloneNode(true);

            copy.style.margin = "0";

            grid.appendChild(copy);

        });

        container.appendChild(page);

    });

    return container;

};

PDFEngine.hasResults = function () {

    return this.getBlocks().length > 0;

};

// ==========================================
// PDF Engine v3.1
// Part 3
// ==========================================

// ==========================================
// PDF Engine v3.1
// Part 3
// ==========================================

PDFEngine.export = async function () {

    try {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);

        pdf.text("SMBC PDF Engine Test", 20, 20);

        pdf.setFontSize(12);

        pdf.text(
            "If you can read this, PDFEngine.export() is working.",
            20,
            35
        );

        pdf.save("SMBC_Test.pdf");

    } catch (err) {

        alert(
            "PDF ERROR:\n\n" + err.message
        );

        console.error(err);

    }

};

