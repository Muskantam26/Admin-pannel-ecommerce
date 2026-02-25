import React, { useState } from "react";
import CommonDataTable from "../Component/CommonDataTable";
import { MainHeading } from "../Component/Heading";
import { RefreshCw } from "lucide-react";

// Dummy data for "Purchase Package"
const dummyPurchaseData = [
  {
    _id: "PP-1",
    user: { username: "john_doe", id: "U-001" },
    package: { name: "Starter Kit", id: "PKG-101" },
    bp: 50,
    amount: 1500,
    purchasedAt: new Date().toISOString(),
  },
  {
    _id: "PP-2",
    user: { username: "jane_smith", id: "U-002" },
    package: { name: "Pro Pack", id: "PKG-102" },
    bp: 150,
    amount: 4500,
    purchasedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "PP-3",
    user: { username: "mike_ross", id: "U-003" },
    package: { name: "Elite Bundle", id: "PKG-103" },
    bp: 500,
    amount: 15000,
    purchasedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const PurchasePackage = () => {
  const [data, setData] = useState(dummyPurchaseData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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
      width: "80px",
    },
    {
      name: "Purchase Date",
      selector: (row) => new Date(row.purchasedAt).toLocaleDateString(),
      sortable: true,
      width: "140px",
    },
    {
      name: "User Details",
      // eslint-disable-next-line no-constant-binary-expression
      selector: (row) => `${row.user?.username} (${row.user?.id})` || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Package Name",
      // eslint-disable-next-line no-constant-binary-expression
      selector: (row) => `${row.package?.name} (${row.package?.id})` || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "BV",
      selector: (row) => row.bp || 0,
      sortable: true,
      width: "100px",
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.amount || 0}`,
      sortable: true,
      width: "120px",
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
          onClick={() => setData(dummyPurchaseData)}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600 self-end sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="card w-full bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
        <div className="flex-1 overflow-x-auto">
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
