import DataTable from "react-data-table-component";
import { Download, FileSpreadsheet } from "lucide-react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const CommonDataTable = ({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage = 6,
  selectable = true,
}) => {


  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '12px',
        color: 'var(--text-main)',
      },
    },
  };

  const downloadCSV = () => {
    const headers = columns
      .filter((col) => col.name && col.name !== "Action")
      .map((col) => col.name);

    const rows = data.map((row) => {
      return columns
        .filter((col) => col.name && col.name !== "Action")
        .map((col) => {
          let val = "";
          if (col.selector) {
            val = typeof col.selector === "function" ? col.selector(row) : row[col.selector];
          }
          // Handle potential null/undefined
          val = val || "";
          // Escape CSV
          if (String(val).includes(",") || String(val).includes("\n") || String(val).includes('"')) {
            return `"${String(val).replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Filter columns
    const exportColumns = columns.filter((col) => col.name && col.name !== "Action");

    // Add Headers
    worksheet.columns = exportColumns.map((col) => ({
      header: col.name,
      key: col.name,
      width: 25, // Default width
    }));

    // Add Data
    for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        const rowValues = {};
        let maxRowHeight = 20; // Default height

        for (const col of exportColumns) {
            let val = "";
            let imageAdded = false;
            
            // Check for image selector first
            if (col.imageSelector) {
                const imageUrl = typeof col.imageSelector === 'function' ? col.imageSelector(rowData) : rowData[col.imageSelector];
                
                if (imageUrl) {
                    try {
                        const response = await fetch(imageUrl, { mode: 'cors' });
                        if(response.ok) {
                            const buffer = await response.arrayBuffer();
                            
                            // Detect extension
                            const ext = imageUrl.split('.').pop().split('?')[0].toLowerCase();
                            const validExts = ['png', 'jpeg', 'jpg', 'gif'];
                            const extension = validExts.includes(ext) ? ext : 'png';

                            // Convert to Base64
                            const base64 = btoa(
                                new Uint8Array(buffer)
                                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
                            );

                            const imageId = workbook.addImage({
                                base64: base64,
                                extension: extension,
                            });
                            
                            // Calculate cell position
                            const colIndex = exportColumns.indexOf(col);
                            
                            worksheet.addImage(imageId, {
                                tl: { col: colIndex, row: i + 1 }, // top-left (0-indexed col, 0-indexed row relative to sheet?)
                                ext: { width: 50, height: 50 },
                                editAs: 'oneCell'
                            });
                            maxRowHeight = 50; // Set row height to fit image
                            imageAdded = true;
                            val = ""; // Cell value empty as image is there
                        } else {
                            val = "Image Load Failed";
                        }
                    } catch (err) {
                        console.error("Error fetching image for excel", err);
                        val = "Image Error";
                    }
                } else {
                     val = "No Image";
                }
            } else if (col.selector) {
                val = typeof col.selector === "function" ? col.selector(rowData) : rowData[col.selector];
            }
            
            rowValues[col.name] = imageAdded ? "" : val;
        }
        
        const addedRow = worksheet.addRow(rowValues);
        addedRow.height = maxRowHeight; 
    }
    
    // Style header
    worksheet.getRow(1).font = { bold: true };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "table_data.xlsx");
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pagination={false}
        selectableRows={selectable}
        responsive
        customStyles={customStyles}
      />

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          <p className="text-xs text-(--text-third) whitespace-nowrap">
            Showing {rowsPerPage} Entries
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
                onClick={downloadCSV}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer whitespace-nowrap"
                title="Download CSV"
            >
                <Download size={14} /> CSV
            </button>
            <button
                onClick={downloadExcel}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                title="Download Excel"
            >
                <FileSpreadsheet size={14} /> Excel
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50 whitespace-nowrap"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
                <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`px-3 py-1 text-xs rounded whitespace-nowrap min-w-[2rem]
                    ${currentPage === index + 1
                    ? "bg-(--bg-green) text-(--text-white)"
                    : "bg-(--bg-main)"
                    }`}
                >
                {index + 1}
                </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50 whitespace-nowrap"
          >
            Next
          </button>
        </div>

      </div>
    </>
  );
};

export default CommonDataTable;
