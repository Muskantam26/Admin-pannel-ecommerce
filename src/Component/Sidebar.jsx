import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../constant/SidebarData';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/slice/loadingSlice';
import { logoutUser } from '../redux/slice/authSlice';
import { useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { MainContent } from '../constant/MainContent';
import { BiLogOut } from 'react-icons/bi';

const manuItems = SIDEBAR_ITEMS;
const Sidebar = ({ open, setOpen }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubMenu = (label) => {
    setExpandedMenu(prev => prev === label ? null : label);
  };

  const { name, email, profileImage, role, permissions } = useSelector((state) => state.auth);

  // Dynamic Avatar based on name
  const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&color=fff`;

  const handleNavigation = (id) => {
    if (id === "logout") {
      dispatch(showLoader());
      setTimeout(() => {
        dispatch(logoutUser());
        dispatch(hideLoader());
      }, 2000);
    } else {
      dispatch(showLoader());
      setTimeout(() => {
        const path = id.startsWith("/") ? id : `/${id}`;
        navigate(path.replace('//', '/'));
        dispatch(hideLoader());
      }, 500);
    }
    setOpen(false); // Close mobile menu if open
  };

  // Check if user has access to this menu item
  const hasAccess = (item) => {
    if (!role) return false;

    // Super Admin has access to everything
    if (role === 'SUPER-ADMIN') return true;

    // Check Role Access
    if (item.allowedRoles && !item.allowedRoles.includes(role)) {
      return false;
    }

    // Check Permission Access (if item has specific permissions required)
    if (item.allowedPermissions && item.allowedPermissions.length > 0) {
      if (!permissions || !permissions.some(p => item.allowedPermissions.includes(p))) {
        return false;
      }
    }

    return true;
  };

  return (

    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-[49] md:hidden transition-opacity duration-300 backdrop-blur-sm
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      />


      <div
        className={`
          fixed top-0 left-0 z-50
          h-full w-64
          bg-(--bg-box) border-r border-(--bs-border) shadow-2xl md:shadow-none
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        <div className="absolute right-3 top-3 md:hidden flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-xl text-(--text-main)" />
          </button>
        </div>


        <div className="flex flex-col h-full">

          {/* Logo Area */}
          <div className="p-5 flex items-center gap-2 justify-center border-b border-dashed border-(--bs-border)">
            <img src={MainContent.appLogo} alt="logo" className="h-12 w-auto object-contain transition-transform hover:scale-105 duration-300" />
            <p className='font-bold text-2xl text-(--text-main)'>{MainContent.appFullName}</p>
          </div>

          {/* Scrollable Menu Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">


            {manuItems.map((item, index) => {

              // Check access permissions
              if (!hasAccess(item)) return null;

              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenu === item.label;
              const isActive = location.pathname === item.id || (item.subItems && item.subItems.some(sub => sub.id === location.pathname));

              return (
                <div key={index}
                  className={`transition-all duration-500 ease-out
                    ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}
                    md:opacity-100 md:translate-x-0
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >

                  {!item.icon ? (
                    <p className="text-(--text-second) text-[10px] uppercase font-bold tracking-wider mt-4 mb-2 ml-3 opacity-80">
                      {item.label}
                    </p>
                  ) : (
                    <div>
                      <div
                        className={`
                          group flex items-center justify-between text-[13px] font-medium p-2.5 mx-1 cursor-pointer rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-(--btn-hover) text-(--text-hover)'
                            : 'text-(--text-main) hover:bg-(--bs-btn-hover) hover:text-(--text-main)'
                          }
                        `}
                        onClick={() => {
                          if (hasSubItems) {
                            toggleSubMenu(item.label);
                          } else {
                            if (item.id) handleNavigation(item.id);
                          }
                        }}



                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`text-lg ${isActive ? 'text-(--text-hover)' : 'text-(--text-icon) group-hover:text-(--bs-primary)'} transition-colors`} />
                          <span>{item.label}</span>
                        </div>
                        {/* Only show chevron if there are subitems */}
                        {hasSubItems && (
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <FiChevronDown />
                          </div>
                        )}
                      </div>

                      {/* Render Submenu with Smooth Transition */}
                      <div
                        className={`ml-4 pl-4 border-l border-(--bs-border) overflow-hidden transition-all duration-300 ease-in-out
                                ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                            `}
                      >
                        {hasSubItems && item.subItems.map((subItem, subIndex) => {
                          if (!hasAccess(subItem)) return null;
                          return (
                            <div
                              key={subIndex}
                              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-[12px] transition-colors mb-1
                                        ${location.pathname === subItem.id
                                  ? 'bg-(--btn-hover) text-(--text-hover) font-semibold'
                                  : 'text-(--text-main) hover:text-(--text-main) hover:bg-(--bs-btn-hover)'}
                                    `}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation(subItem.id);
                              }}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${location.pathname === subItem.id ? 'bg-(--text-hover)' : 'bg-(--text-main)'}`}></span>
                              <span>{subItem.label}</span>
                            </div>
                          )
                        })}
                      </div>


                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Profile Footer */}
          <div className="p-3 mt-auto border-t border-(--bs-border)">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-(--bg-main) border border-(--bs-border)">
              <img
                src={profileImage || userImage}
                alt="user"
                className="w-9 h-9 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-(--text-main) truncate">{name || "User"}</p>
                <p className="text-[10px] text-(--text-second) truncate">{email || "admin@example.com"}</p>
              </div>
              <button
                onClick={() => handleNavigation('logout')}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <BiLogOut size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default Sidebar;