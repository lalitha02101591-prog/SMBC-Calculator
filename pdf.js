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

// =

    });

    return container;

};


// ==========================================
// Capture one rendered PDF page
// ==========================================

PDFEngine.capturePage = async function (pageElement) {

    const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true
    });

    return canvas;

};



/* ==========================================================
   Part 2
   DOM Builder Module
   ========================================================== */


/* ----------------------------------------------------------
   Validate export requirements
---------------------------------------------------------- */

function validateExport() {

    if (!window.html2canvas) {
        throw new Error("html2canvas library not loaded.");
    }

    if (!window.jspdf) {
        throw new Error("jsPDF library not loaded.");
    }

    if (!window.resultArea) {
        throw new Error("resultArea not found.");
    }

    const blocks = resultArea.querySelectorAll(".pairBlock");

    if (blocks.length === 0) {
        throw new Error("Please calculate the SMBC results before exporting.");
    }

    if (typeof createPrintPages !== "function") {
        throw new Error("createPrintPages() is missing.");
    }

}


/* ----------------------------------------------------------
   Build printable pages
---------------------------------------------------------- */

function buildPages() {

    const pages = createPrintPages();

    if (!pages || pages.length === 0) {
        throw new Error("No printable pages were generated.");
    }

    return pages;

}


/* ----------------------------------------------------------
   Hidden render container
---------------------------------------------------------- */

function createRenderHost() {

    const host = document.createElement("div");

    host.id = "smbc_pdf_render_host";

    host.style.position = "fixed";
    host.style.left = "-100000px";
    host.style.top = "0";

    host.style.width = "210mm";
    host.style.background = "#ffffff";

    host.style.zIndex = "-9999";

    document.body.appendChild(host);

    return host;

}


/* ----------------------------------------------------------
   Remove render container
---------------------------------------------------------- */

function destroyRenderHost(host) {

    if (host && host.parentNode) {
        host.parentNode.removeChild(host);
    }

}


/* ----------------------------------------------------------
   Insert printable pages
---------------------------------------------------------- */

function mountPages(host, pages) {

    pages.forEach(page => {

        host.appendChild(clone(page));

    });

}

/* ==========================================================
   Part 3
   html2canvas Rendering Module
   ========================================================== */


/* ----------------------------------------------------------
   Render one page
---------------------------------------------------------- */

async function renderPage(pageElement) {

    const canvas = await html2canvas(pageElement, {

        scale: CONFIG.render.scale,
        useCORS: CONFIG.render.useCORS,
        backgroundColor: CONFIG.render.backgroundColor,
        logging: false

    });

    return canvas;

}


/* ----------------------------------------------------------
   Render all pages
---------------------------------------------------------- */

async function renderAllPages(pageElements) {

    const canvases = [];

    for (const page of pageElements) {

        const canvas = await renderPage(page);

        canvases.push(canvas);

    }

    return canvases;

}


/* ----------------------------------------------------------
   Canvas → Image
---------------------------------------------------------- */

function canvasToImage(canvas) {

    return canvas.toDataURL(
        "image/jpeg",
        1.0
    );

}


/* ----------------------------------------------------------
   Convert all canvases
---------------------------------------------------------- */

function convertAllImages(canvases) {

    return canvases.map(canvasToImage);

}


/* ----------------------------------------------------------
   Render Pipeline
---------------------------------------------------------- */

async function renderPipeline() {

    validateExport();

    createPDF();

    resetCursor();

    const pages = buildPages();

    const host = createRenderHost();

    try {

        mountPages(host, pages);

        const mountedPages = getMountedPages(host);

        const canvases = await renderAllPages(mountedPages);

        return convertAllImages(canvases);

    } finally {

        destroyRenderHost(host);

    }

}

/* ==========================================================
   Part 4
   jsPDF Composition Module
   ========================================================== */


/* ----------------------------------------------------------
   Add one image to the PDF
---------------------------------------------------------- */

function addImageToPDF(imageData, isFirstPage) {

    if (!isFirstPage) {
        Runtime.pdf.addPage();
    }

    Runtime.pdf.addImage(
        imageData,
        "JPEG",
        0,
        0,
        Runtime.pageWidth,
        Runtime.pageHeight,
        undefined,
        "FAST"
    );

}


/* ----------------------------------------------------------
   Build the complete PDF
---------------------------------------------------------- */

function composePDF(images) {

    if (!images || images.length === 0) {
        throw new Error("No rendered pages available.");
    }

    images.forEach((image, index) => {
        addImageToPDF(image, index === 0);
    });

}


/* ----------------------------------------------------------
   Generate default filename
---------------------------------------------------------- */

function createFileName() {

    const now = new Date();

    const yyyy = now.getFullYear();

    const mm = String(now.getMonth() + 1).padStart(2, "0");

    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");

    const mi = String(now.getMinutes()).padStart(2, "0");

    return `SMBC_${yyyy}${mm}${dd}_${hh}${mi}.pdf`;

}


/* ----------------------------------------------------------
   Save PDF
---------------------------------------------------------- */

function savePDF(fileName) {

    Runtime.pdf.save(fileName);

}
/* ----------------------------------------------------------
   Return mounted pages
---------------------------------------------------------- */

function getMountedPages(host) {

    return [...host.querySelectorAll(".pdfPage")];

}


/* ==========================================================
   Part 5
   Export API
   ========================================================== */

async function exportPDF() {

    const button = document.getElementById("pdfBtn");

    const originalText = button ? button.textContent : "";

    try {

        if (button) {
            button.disabled = true;
            button.textContent = "Generating PDF...";
        }

        const images = await renderPipeline();

        composePDF(images);

        savePDF(createFileName());

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }

    }

}


