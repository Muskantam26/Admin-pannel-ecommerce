import React, { useState, useEffect } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { MainHeading } from "../Component/Heading";
import { RefreshCw } from "lucide-react";
import { getAllTransations } from "../api/transaction-api";
import { toast } from "react-toastify";
import PageLoader from "../Component/PageLoader";

const PurchasePackage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getAllTransations({});

      if (res?.success) {
        setData(res?.data?.history || []);
        // console.log("API Response", res.data.history);
      } else {
        toast.error(res?.message || "Failed to fetch transactions.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Internal Server Error while fetching.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: false,
    },

    {
      name: "User Name",
      selector: (row) => `${row.user?.username}${row.user.id}` || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Package Name",
      selector: (row) => (row.package ? row.package.name : "N/A"),
      sortable: true,
      width: "150px",
    },
    {
      name: "Description",
      selector: (row) => row.description || "N/A",
      sortable: true,
      width: "500px",
    },
    {
      name: "PV",
      selector: (row) => row.pv || 0,
      sortable: true,
    },
    {
      name: "Investment",
      selector: (row) => `₹${row.investment || 0}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Purchased By",
      selector: (row) => row.purchaseBy,
      sortable: true,
      width: "150px",
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt || "N/A",
      sortable: true,
      width: "250px",
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <MainHeading
          title={"Purchased Packages"}
          subtitle={"View all packages purchased by users."}
        />
        <button
          onClick={fetchTransactions}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600 self-end sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="card w-full bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
        <div className="flex-1 overflow-x-auto">
          {loading && <PageLoader />}
          <CommonDataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            selectable={false}
            showSearch={true}
          />
        </div>
      </div>
    </>
  );
};

export default PurchasePackage;
