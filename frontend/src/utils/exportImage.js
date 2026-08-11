import html2canvas from "html2canvas";

export const exportElementToImage = async (element, filename = "dashboard-screenshot.png") => {
    if (!element) {
        throw new Error("No element was provided for export.");
    }

    const canvas = await html2canvas(element, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
        logging: false,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
};
