import React, { useState } from "react";
import { Heading, MainHeading } from "../Component/Heading";
import Button from "../Component/Btn";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import Banner from "../Component/Banner";
import CommonDataTable from "../Component/CommonDataTable";
import { useNavigate } from "react-router-dom";
import Modal from "../Component/Model/Modal";
import HeroBannerCard from "./HeroBannerCard";
import { PathRoutes } from "../constant/Path";

const SiteManager = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [sitedata] = useState([
    {
      id: 1,
      sl: "01",
      name: "Hero Banner",
      banner_type: "Slider Banner",
      type: "Group Banner",
      page_name: "Home page",
      last_update: "13/13/Huzur",
      total_images: "3 Images",
      images: [
        "src/assets/BannerTwo.png",
        "src/assets/Bannerone.png",
        "src/assets/Bannerfifth.png"


      ],
    },
    {
      id: 2,
      sl: "02",
      name: "Reward Banner",
      banner_type: "Group Banner",
      page_name: "Invite Page",
      last_update: "13/13/Huzur",
      total_images: "3 Images",
      images: [
        "src/assets/Bannerfifth.png",
        "src/assets/BannerFour.png",
        "src/assets/Bannerone.png"
      ],
    },
    
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const totalPages = Math.ceil(sitedata.length / rowsPerPage);

  const paginatedData = sitedata.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const actions = {
    view: (row) => {
      setSelectedBanner({
        name: row.name,
        type: row.banner_type,
        imageCount: row.total_images,
        lastUpdate: row.last_update,
        status: "Active",
        platform: "User Panel",
        images: row?.images,
      });
      setIsModalOpen(true);
    },
    edit: () => {
      navigate(PathRoutes.EDIT_BANNER);
    },
    delete: (row) => {
      console.log("Delete", row);
    },
  };

  const columns = [
    {
      name: "SL",
      selector: (row) => row.sl,
    },
    {
      name: "NAME",
      selector: (row) => row.name,
    },
    {
      name: "Banner Type",
      selector: (row) => row.banner_type,
    },
    {
      name: "Page Name",
      selector: (row) => row.page_name,
    },
    {
      name: "Last Update",
      selector: (row) => row.last_update,
    },
    {
      name: "Total Images",
      selector: (row) => row.total_images,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          {actions.view && (
            <button
              onClick={() => actions.view(row)}
              className="bg-(--bs-action) text-(--bs-action-icon) p-1 rounded-md cursor-pointer"
            >
              <FiEye size={14} />
            </button>
          )}
          {actions.edit && (
            <button
              onClick={() => actions.edit(row)}
              className="bg-(--bs-action) text-(--bs-action-icon) p-1 rounded-md cursor-pointer"
            >
              <FiEdit size={14} />
            </button>
          )}
          {actions.delete && (
            <button
              onClick={() => actions.delete(row)}
              className="bg-(--bs-action) text-(--bs-action-icon) p-1 rounded-md cursor-pointer"
            >
              <FiTrash size={14} />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <MainHeading
        title={"Site Managetment"}
        subtitle={
          "Real-time overview of orders, payments, customers & operations"
        }
      />

      <div className="bg-(--bg-box) rounded-xl shadow-xl p-4 mt-5">
        <div className="flex justify-between">
          <Heading title={"User Panel Banner List"} subtitle={"Content"} />

          <Button
          title={"Add Banner"}
          className="rounded-sm text-xs px-3 h-7 shadow-2xl"
          />
        </div>

        <div className="p-4 ">
          <CommonDataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <HeroBannerCard
            bannerDetails={selectedBanner}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default SiteManager;
