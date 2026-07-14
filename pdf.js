// ==========================================
// SMBC PDF Engine v4.2
// Chunk 1
// Standalone PDF Engine
// ==========================================

"use strict";

window.PDFEngine = {

    pageWidth: 210,
    pageHeight: 297,

    columns: 4,
    rows: 3,

    blocksPerPage: 12,

    margin: 5,

    async export() {

        const resultArea = document.getElementById("resultArea");

        if (!resultArea || !resultArea.querySelector(".pairBlock")) {
            alert("Please calculate SMBC first.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true
        });

        const pages = this.createPrintPages();

        for (let i = 0; i < pages.length; i++) {

            if (i > 0) pdf.addPage();

            const canvas = await html2canvas(pages[i], {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true
            });

            const img = canvas.toDataURL("image/png");

            pdf.addImage(
                img,
                "PNG",
                0,
                0,
                this.pageWidth,
                this.pageHeight,
                undefined,
                "FAST"
            );
        }

        pdf.save("SMBC.pdf");

        this.removeHiddenContainer();

    },

    createPrintPages() {

        const container = this.createHiddenContainer();

        const pages = [];

        const sections = this.getSections();

        sections.forEach(section => {

            const blocks = [...section.querySelectorAll(".pairBlock")];

            const blockPages = this.splitIntoPages(blocks);

            blockPages.forEach(blockSet => {

                const page = this.createPage(section, blockSet);

                container.appendChild(page);

                pages.push(page);

            });

        });

        return pages;

    },

    splitIntoPages(blocks) {

        const pages = [];

        for (let i = 0; i < blocks.length; i += this.blocksPerPage) {

            pages.push(
                blocks.slice(i, i + this.blocksPerPage)
            );

        }

        if (pages.length === 0) pages.push([]);

        return pages;

    },

    // ==========================================
// SMBC PDF Engine v4.2
// Chunk 2
// ==========================================

    getSections() {

        const resultArea = document.getElementById("resultArea");

        const sections = [];

        let current = null;

        [...resultArea.children].forEach(node => {

            const cls = node.classList;

            if (
                cls.contains("subTitle") ||
                cls.contains("subtitle") ||
                cls.contains("sectionTitle")
            ) {

                current = document.createElement("div");
                current.className = "pdfSection";

                current.appendChild(node.cloneNode(true));

                sections.push(current);

                return;
            }

            if (!current) {

                current = document.createElement("div");
                current.className = "pdfSection";

                sections.push(current);

            }

            if (cls.contains("pairBlock")) {

                current.appendChild(node.cloneNode(true));

            }

        });

        return sections;

    },

    createPage(section, blocks) {

        const page = document.createElement("div");
        page.className = "pdfPage";

        const title = section.firstElementChild
            ? section.firstElementChild.cloneNode(true)
            : document.createElement("div");

        title.classList.add("pdfHeading");

        page.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "pdfGrid";

        page.appendChild(grid);

        blocks.forEach(block => {

            grid.appendChild(block.cloneNode(true));

        });

        while (grid.children.length < this.blocksPerPage) {

            const blank = document.createElement("div");
            blank.className = "pairBlock pdfBlank";

            grid.appendChild(blank);

        }

        return page;

    },

    createHiddenContainer() {

        this.removeHiddenContainer();

        const div = document.createElement("div");

        div.id = "__pdfContainer";

        div.style.position = "fixed";
        div.style.left = "-100000px";
        div.style.top = "0";
        div.style.width = "210mm";
        div.style.background = "#fff";
        div.style.zIndex = "-1";

        document.body.appendChild(div);

        return div;

    },

    
// ==========================================
// SMBC PDF Engine v4.2
// Chunk 3
// ==========================================

    removeHiddenContainer() {

        const old = document.getElementById("__pdfContainer");

        if (old) old.remove();

    },

    injectStyles() {

        if (document.getElementById("__pdfStyles")) return;

        const style = document.createElement("style");

        style.id = "__pdfStyles";

        style.textContent = `

#___dummy___{}

#__pdfContainer{
    font-family:Arial,sans-serif;
}

.pdfPage{
    width:210mm;
    height:297mm;
    box-sizing:border-box;
    padding:5mm;
    background:#fff;
    overflow:hidden;
    page-break-after:always;
}

.pdfHeading{
    font-size:14pt;
    font-weight:bold;
    text-align:center;
    margin-bottom:4mm;
}

.pdfGrid{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    grid-template-rows:repeat(3,1fr);

    gap:3mm;

    height:278mm;

}

.pdfGrid>.pairBlock{

    box-sizing:border-box;

    overflow:hidden;

}

.pdfBlank{

    visibility:hidden;

}

`;

        document.head.appendChild(style);

    }

};

PDFEngine.injectStyles();
