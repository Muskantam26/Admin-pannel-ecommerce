import DataTable from "react-data-table-component";

const CommonDataTable = ({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage = 6,
  selectable = true,
}) => {


  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pagination={false}
        selectableRows={selectable}
        responsive

      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-(--text-third)">
          Showing {rowsPerPage} Entries
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`px-3 py-1 text-xs rounded
                ${currentPage === index + 1
                  ? "bg-(--bg-green) text-(--text-white)"
                  : "bg-(--bg-main)"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 text-xs rounded bg-(--bg-main) disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CommonDataTable;
