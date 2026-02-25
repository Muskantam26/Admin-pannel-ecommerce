import React, { useEffect, useState } from 'react';
import { MainHeading } from '../Component/Heading';
import CommonDataTable from '../Component/CommonDataTable';
import { getAllDisplayItemsApi, deleteDisplayItemApi, toggleDisplayVisibilityApi } from '../api/display-api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi';
import Button from '../Component/Btn';
import ConfirmationModal from '../Component/Model/ConfirmationModal';
import ImagePreviewModal from '../Component/Model/ImagePreviewModal';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllDisplayItemsApi({ type: 'BANNER' });
      if (res.success) {
        setBanners(res.data.filter(item => item.type === 'BANNER'));
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleVisibility = async (id) => {
    try {
      const res = await toggleDisplayVisibilityApi(id);
      if (res.success) {
        toast.success(res.message);
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteDisplayItemApi(selectedId);
      if (res.success) {
        toast.success("Banner deleted successfully");
        setIsDeleteModalOpen(false);
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const openPreview = (url) => {
    setPreviewImageUrl(url);
    setIsPreviewOpen(true);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "150px"
    },
    {
      name: "Banner Image",
      selector: (row) => row.content,
      cell: (row) => (
        <div
          className="w-24 h-14 rounded-lg overflow-hidden border border-(--bs-border) cursor-pointer group relative my-2"
          onClick={() => openPreview(row.content)}
        >
          <img src={row.content} alt="banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiEye className="text-white" />
          </div>
        </div>
      ),
      width: "150px"
    },
    {
      name: "Target Link",
      selector: (row) => row.link,
      sortable: true,
      cell: (row) => (
        row.link ? (
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-500 hover:underline max-w-[200px] truncate"
          >
            {row.link} <FiExternalLink size={12} />
          </a>
        ) : (
          <span className="text-gray-400 italic">No link</span>
        )
      )
    },
    {
      name: "Order",
      selector: (row) => row.order,
      sortable: true,
      width: "100px"
    },
    {
      name: "Status",
      selector: (row) => row.isVisible,
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => handleToggleVisibility(row._id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${row.isVisible
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
          {row.isVisible ? <FiEye /> : <FiEyeOff />}
          {row.isVisible ? "VISIBLE" : "HIDDEN"}
        </button>
      ),
      width: "120px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedId(row._id);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
      width: "100px"
    }
  ];

  return (
    <div className="pb-10 bg-transparent animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <MainHeading
          title={"Banner Management"}
          subtitle={"Manage sliding banners for the website home page"}
        />
        <Button
          title={"Add New Banner"}
          icon={<FiPlus size={18} />}
          onClick={() => navigate('/add-banner')}
          className="bg-(--bs-btn) text-white shadow-md hover:shadow-xl transition-all"
        />
      </div>

      <div className="bg-(--bg-box) p-3 rounded-2xl shadow-sm border border-(--bs-border) overflow-hidden">
        <CommonDataTable
          data={banners}
          columns={columns}
          loading={loading}
          title="Banner List"
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImageUrl}
        title="Banner Preview"
      />
    </div>
  );
};

export default Banner;
