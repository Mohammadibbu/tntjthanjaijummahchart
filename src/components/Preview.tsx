import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Download, Trash2, ArrowLeft, Check, Palette } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import TNTJTHANJAIHEADING from "./assets/img/TNTJTHANJAIHEADING.jpg";

type TableTheme = "classic" | "ocean" | "sunset" | "forest";

const TABLE_THEMES: Record<
  TableTheme,
  {
    name: string;
    evenBg: string;
    oddBg: string;
    color: string;
    header: string;
    subheading: string;
    border: string;
    tablebg_outset: string;
  }
> = {
  classic: {
    name: "Classic",
    evenBg: "bg-gray-50", // softer light gray
    oddBg: "bg-white",
    color: "bg-gray-50",
    header: "bg-gray-700 text-white", // deep gray header
    subheading: "bg-gray-200 text-gray-800", // muted subheader
    border: "border-gray-300",
    tablebg_outset: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
  },
  ocean: {
    name: "Ocean",
    evenBg: "bg-blue-50",
    oddBg: "bg-blue-100",
    color: "bg-blue-100",
    header: "bg-blue-600 text-white",
    subheading: "bg-blue-200 text-blue-800",
    border: "border-blue-400",
    tablebg_outset: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700",
  },
  sunset: {
    name: "Sunset",
    evenBg: "bg-orange-50",
    oddBg: "bg-orange-100",
    color: "bg-orange-100",
    header: "bg-orange-600 text-white",
    subheading: "bg-orange-200 text-orange-800",
    border: "border-orange-400",
    tablebg_outset:
      "bg-gradient-to-r from-orange-900 via-orange-800 to-orange-700",
  },
  forest: {
    name: "Forest",
    evenBg: "bg-green-50",
    oddBg: "bg-green-100",
    color: "bg-green-100",
    header: "bg-green-700 text-white",
    subheading: "bg-green-200 text-green-800",
    border: "border-green-400",
    tablebg_outset:
      "bg-gradient-to-r from-green-900 via-green-800 to-green-700",
  },
};

export const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previewRef = useRef<HTMLDivElement>(null);

  const { tableData = [], selectedDate } = (location.state as any) || {};

  // const [bgImage, setBgImage] = useState<string | null>(null);
  const [footerImage, setFooterImage] = useState<string | null>(null);
  const [tableTheme, setTableTheme] = useState<TableTheme>("classic");
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleThemeChange = (theme: TableTheme) => {
    setTableTheme(theme);
    toast.success(`Table theme changed to ${TABLE_THEMES[theme].name}`);
  };

  const handleExport = async (format: "pdf" | "png" | "jpg") => {
    const element = previewRef.current;
    if (!element) return;

    setIsExporting(true);
    setExportSuccess(null);

    try {
      const original = {
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
      };

      const actualWidth = 1000;

      const actualHeight = 3500;
      console.log(actualWidth, actualHeight);

      // Temporarily move off-screen to prevent scroll interference
      Object.assign(element.style, {
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        // transform: "scale(1)",
        position: "absolute",
        left: "-9999px",
        top: "0",
      });

      await new Promise((r) => setTimeout(r, 150));

      // Capture the element to canvas
      const canvas = await html2canvas(element, {
        scale: 2, // higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff", // solid white background
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original styles
      Object.assign(element.style, original);

      // Convert to image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (format === "png" || format === "jpg") {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `jummah_schedule_${Date.now()}.${format}`;
        link.click();
      } else {
        const pdf = new jsPDF("p", "px");

        // A4 dimensions in pixels
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Scale ratio to fit inside A4 while preserving aspect ratio
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight, 1);
        // The `1` ensures we don’t scale up if image is smaller than A4

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        // Center the image on the page
        const offsetX = (pdfWidth - newWidth) / 2;
        const offsetY = (pdfHeight - newHeight) / 2;

        pdf.addImage(imgData, "JPEG", offsetX, offsetY, newWidth, newHeight);
        pdf.save(`jummah_schedule_${Date.now()}.pdf`);
      }

      setExportSuccess(format.toUpperCase());
      toast.success(`Exported successfully as ${format.toUpperCase()}!`);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 md:p-8">
      {/* Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-200 rounded-full" />
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-xl font-bold text-slate-800">
              Preparing your file...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 px-4 py-2.5 bg-white text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Editor</span>
          </button>
        </div>

        <div className="fixed bottom-0 left-0 flex justify-between lg:px-44 w-full z-50 bg-white p-5 shadow-2xl">
          {(["pdf", "png", "jpg"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              disabled={isExporting}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold shadow-md text-sm md:text-base transition-all ${
                exportSuccess === fmt.toUpperCase()
                  ? "bg-green-600 text-white scale-105"
                  : "bg-gray-800 text-slate-100 hover:bg-slate-600"
              }`}
            >
              {exportSuccess === fmt.toUpperCase() ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>{fmt.toUpperCase()}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Design Customization */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Customize Design
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Theme */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase">
                Table Theme
              </label>
              <select
                value={tableTheme}
                onChange={(e) =>
                  handleThemeChange(e.target.value as TableTheme)
                }
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-xl bg-white text-slate-700 font-semibold text-sm md:text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {(Object.keys(TABLE_THEMES) as TableTheme[]).map((theme) => (
                  <option key={theme} value={theme}>
                    {TABLE_THEMES[theme].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Fields */}
            {/* <UploadField
              label="Background Image"
              image={bgImage}
              setImage={setBgImage}
              successMsg="Background image uploaded!"
              removeMsg="Background image removed"
            /> */}

            <UploadField
              label="Footer Image"
              image={footerImage}
              setImage={setFooterImage}
              successMsg="Footer image uploaded!"
              removeMsg="Footer image removed"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span>Live Preview</span>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">
                Zoom:
              </label>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="font-semibold text-slate-700 w-12 text-right">
                {zoom}%
              </span>
            </div>
          </h2>

          <div className="w-full overflow-auto flex justify-center">
            <div
              ref={previewRef}
              className={`   px-6 py-10  transition-transform duration-300 origin-top`}
              style={{
                width: "100%",
                maxWidth: "1000px",
                minWidth: "300px",
                height: "fit-content",
                maxHeight: "fit-content",
                transform: `scale(${zoom / 100})`,
              }}
            >
              <table className="w-full max-w-5xl border-collapse text-lg  font-extrabold overflow-hidden select-none">
                <thead>
                  <tr>
                    <td
                      colSpan={4}
                      className={`p-0 border ${TABLE_THEMES[tableTheme].border}`}
                    >
                      <img
                        src={TNTJTHANJAIHEADING}
                        alt="TNTJ Thanjai Heading"
                        className="w-full h-auto object-cover rounded-t-xl"
                      />
                    </td>
                  </tr>
                  <tr className={`${TABLE_THEMES[tableTheme].subheading}`}>
                    <td
                      colSpan={4}
                      className={`px-6 py-4 text-center align-middle font-extrabold text-2xl border ${TABLE_THEMES[tableTheme].border}`}
                    >
                      இன்ஷா அல்லாஹ்{"  "}
                      {selectedDate || "தேதி தேர்ந்தெடுக்கப்படவில்லை"}
                    </td>
                  </tr>
                  <tr className={`${TABLE_THEMES[tableTheme].header}`}>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      நேரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      கிளைகள் விவரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      தொடர்பு
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      பேச்சாளர் விவரம்
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0
                          ? TABLE_THEMES[tableTheme].evenBg
                          : TABLE_THEMES[tableTheme].oddBg
                      }  transition`}
                    >
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} font-semibold text-center align-middle whitespace-nowrap`}
                      >
                        {row.time}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle whitespace-nowrap`}
                      >
                        {row.branch}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle whitespace-nowrap`}
                      >
                        {row.phone}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-red-700 font-semibold text-center align-middle whitespace-nowrap`}
                      >
                        {row.dai_name_contact}
                      </td>
                    </tr>
                  ))}
                  {footerImage && (
                    <tr>
                      <td colSpan={4}>
                        <img
                          src={footerImage}
                          alt="Footer"
                          className="w-full h-24 md:h-36 object-cover rounded-b-xl"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ✅ Reusable UploadField Component */
const UploadField = ({
  label,
  image,
  setImage,
  successMsg,
  removeMsg,
}: {
  label: string;
  image: string | null;
  setImage: (val: string | null) => void;
  successMsg: string;
  removeMsg: string;
}) => (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-slate-700 uppercase">
      {label}
    </label>
    <div className="flex items-center gap-3">
      <label className="flex-1 cursor-pointer">
        <div className="border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-600 text-sm text-center hover:border-primary hover:bg-slate-100 transition-all">
          {image ? "✓ Change Image" : "📤 Upload Image"}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(URL.createObjectURL(file));
              toast.success(successMsg);
            }
          }}
        />
      </label>
      {image && (
        <button
          onClick={() => {
            setImage(null);
            toast.info(removeMsg);
          }}
          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);
