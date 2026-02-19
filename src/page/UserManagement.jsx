import React, { useState, useEffect } from 'react'
import { Heading, MainHeading } from '../Component/Heading'
import { MainContent } from '../constant/MainContent';
import InputBox from '../Component/InputBox';
import UserCards from '../Component/UserCards'
import { CgProfile } from 'react-icons/cg'
import CommonDataTable from '../Component/CommonDataTable'
import { Eye, Pencil, User, Lock, Unlock, LogIn, Key } from 'lucide-react'
import { RiDeleteBin6Line, RiProfileFill } from 'react-icons/ri'
import Button, { ActionButton } from '../Component/Btn'
import Modal from '../Component/Model/Modal'
import AddMember from './AddMember'
import ChangePassword from './ChangePassword'
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../Component/Model/ConfirmationModal';
import { getAllUsersApi, toggleUserBlockApi, toggleUserWithdrawalApi, loginAsUserApi } from "../api/user-api";
import { toast } from "react-toastify";


const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsersApi();
    if (res.success) {
      setUsers(res.data || []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleAction = (type, data) => {
    setModalConfig({ isOpen: true, type, data });
  };

  const confirmAction = async () => {
    const { type, data } = modalConfig;
    let res;

    switch (type) {
      case 'block':
        res = await toggleUserBlockApi(data.id);
        break;
      case 'withdrawal':
        res = await toggleUserWithdrawalApi(data.id);
        break;
      case 'login':
        res = await loginAsUserApi(data.id);
        break;
      default:
        return;
    }

    if (res?.success) {
      toast.success(res.message);
      if (type === 'login') {
        window.open(`${MainContent.appURL}/login`, '_blank');
      } else {
        fetchUsers();
      }
    } else {
      toast.error(res?.message || "Action Failed");
    }
    setModalConfig({ isOpen: false, type: '', data: null });
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id || row._id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName || "N/A",
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Sponsor",
      selector: (row) => row.sponsor?.username || "N/A",
      sortable: true,
    },
    {
      name: "Parent",
      selector: (row) => row.binaryParent?.username || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile || "N/A",
    },
    {
      name: "Role",
      selector: (row) => row.role || "USER",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex gap-1">
          {row.active?.isActive ? (
            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-medium">Blocked</span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">Active</span>
          )}
          {!row.active?.isVerified && (
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600 font-medium">Unverified</span>
          )}
        </div>
      ),
    },
    {
      name: "KYC",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.kyc ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {row.kyc ? "Verified" : "Pending"}
        </span>
      ),
    },
    {
      name: "Team",
      selector: (row) => row.totalDownlineUsers || 0,
      sortable: true,
      center: true,
    },
    {
      name: "Withdrawal",
      cell: (row) => (
        <button
          onClick={() => handleAction('withdrawal', { id: row._id || row.id, status: row.active?.isWithdrawal })}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${row.active?.isWithdrawal
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          title="Toggle Withdrawal"
        >
          {row.active?.isWithdrawal ? "Enabled" : "Disabled"}
        </button>
      )
    },
    {
      name: "Join Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Directs", // Renamed for space
      selector: (row) => row.totalDirectUsers || 0,
      sortable: true,
      center: true
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/user-profile/${row._id || row.id}`)}
            className="p-2 rounded-lg cursor-pointer bg-blue-100 text-blue-600"
            title="View Details">
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleAction('block', { id: row._id || row.id, status: row.active?.isBlocked })}
            className={`p-2 rounded-lg cursor-pointer ${row.active?.isBlocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
            title={row.active?.isBlocked ? "Unblock User" : "Block User"}
          >
            {row.active?.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
          </button>
          <button
            onClick={() => handleAction('login', { id: row._id || row.id, username: row.username })}
            className="p-2 rounded-lg cursor-pointer bg-indigo-100 text-indigo-600"
            title="Login as User"
          >
            <LogIn size={14} />
          </button>
          <button
            onClick={() => {
              setSelectedUserForPassword(row._id || row.id);
              setIsChangePasswordOpen(true);
            }}
            className="p-2 rounded-lg cursor-pointer bg-purple-100 text-purple-600"
            title="Change Password"
          >
            <Key size={14} />
          </button>
        </div>
      ),
    },
  ];



  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    (user.fullName || user.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.mobile || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  // Calculate Summary Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active?.isActive).length;
  const blockedUsers = users.filter(u => u.active?.isBlocked).length;
  const unverifiedUsers = users.filter(u => !u.active?.isVerified).length;

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <MainHeading
          title={"User Management"}
          subtitle={"Real-time overview of users & operations"}
        />

        <ActionButton
          title='Add User'
          icon={<User size={15} />}
          className='flex h-8 text-(--text-second) px-4 items-center gap-2'
          onClick={() => setIsAddUserOpen(true)}
        />

        <Modal isOpen={isAddUserOpen}>
          <AddMember onClose={() => setIsAddUserOpen(false)} onSuccess={() => {
            setIsAddUserOpen(false);
            fetchUsers();
          }} />
        </Modal>

        <Modal isOpen={isChangePasswordOpen}>
          <ChangePassword
            onClose={() => setIsChangePasswordOpen(false)}
            userId={selectedUserForPassword}
            onSuccess={() => { }}
          />
        </Modal>
      </div>

      <div className="bg-(--bg-box) rounded-2xl p-5 shadow-sm border border-gray-100">
        <Heading title={"User Statistics"} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5'>
          <UserCards
            icon={<CgProfile className="text-blue-600" size={24} />}
            totalorders={"Total Users"}
            iconBg='bg-blue-100'
            amount={totalUsers}
          />
          <UserCards
            icon={<CgProfile className="text-green-600" size={24} />}
            totalorders={"Active Members"}
            iconBg='bg-green-100'
            amount={activeUsers}
          />
          <UserCards
            icon={<CgProfile className="text-red-600" size={24} />}
            totalorders={"Blocked Users"}
            iconBg='bg-red-100'
            amount={blockedUsers}
          />
          <UserCards
            icon={<CgProfile className="text-yellow-600" size={24} />}
            totalorders={"Unverified Users"}
            iconBg='bg-yellow-100'
            amount={unverifiedUsers}
          />
        </div>
      </div>

      <div className='bg-(--bg-box) rounded-2xl p-5 mt-5 shadow-sm border border-gray-100'>
        <div className='flex justify-between'>
          <Heading title={"User List"} />
          <div className="mb-4 mt-4 ">
            <InputBox
              placeholder="Search User"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center">Loading users...</div>
        ) : (
          <CommonDataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmAction}
        title={
          modalConfig.type === 'block' ? (modalConfig.data?.status ? "Unblock User" : "Block User") :
            modalConfig.type === 'withdrawal' ? (modalConfig.data?.status ? "Disable Withdrawal" : "Enable Withdrawal") :
              modalConfig.type === 'login' ? "Login as User" : "Confirm Action"
        }
        message={
          modalConfig.type === 'block' ? `Are you sure you want to ${modalConfig.data?.status ? "unblock" : "block"} this user?` :
            modalConfig.type === 'withdrawal' ? `Are you sure you want to ${modalConfig.data?.status ? "disable" : "enable"} withdrawal for this user?` :
              modalConfig.type === 'login' ? `Are you sure you want to login as ${modalConfig.data?.username}?` :
                "Are you sure you want to proceed?"
        }
        isDanger={
          (modalConfig.type === 'block' && !modalConfig.data?.status) ||
          (modalConfig.type === 'withdrawal' && modalConfig.data?.status)
        }
        confirmText={
          modalConfig.type === 'block' ? (modalConfig.data?.status ? "Unblock" : "Block") :
            modalConfig.type === 'withdrawal' ? (modalConfig.data?.status ? "Disable" : "Enable") :
              modalConfig.type === 'login' ? "Login" : "Confirm"
        }
      />
    </div>
  )
}

export default UserManagement