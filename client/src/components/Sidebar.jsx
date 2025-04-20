import {
  BarChart2, Users, DollarSign, Book, TrendingUp, Settings,
  ShoppingBag, ShoppingCart, Calendar, FileText, Briefcase,
  Instagram, Youtube, Tv, PieChart, UserCheck, Award, FileSpreadsheet,
  ChevronDown, ChevronRight, Globe, Target, Gift, Zap, Menu, Home,
  Mail, Send, Archive, Clipboard, UserPlus, ChevronsLeft
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from 'react-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({
    finance: false,
    secretariat: false,
    ecrav: false,
    cmi: false,
    pod: false,
    pr: false,
    management: false,
  });
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [tooltipInfo, setTooltipInfo] = useState({ show: false, text: "", y: 0 });

  const sidebarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!isSidebarOpen) {
      const resetGroups = {};
      Object.keys(expandedGroups).forEach((key) => {
        resetGroups[key] = false;
      });
      setExpandedGroups(resetGroups);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const activeElement = document.querySelector(".sidebar-active");
    if (activeElement && sidebarRef.current) {
      const sidebarTop = sidebarRef.current.scrollTop;
      const sidebarBottom = sidebarTop + sidebarRef.current.clientHeight;
      const activeTop = activeElement.offsetTop;
      const activeBottom = activeTop + activeElement.clientHeight;
      if (activeTop < sidebarTop || activeBottom > sidebarBottom) {
        sidebarRef.current.scrollTop = activeTop - 100;
      }
    }
  }, [location.pathname, expandedGroups]);

  const toggleGroup = (group) => {
    if (isSidebarOpen) {
      setExpandedGroups({
        ...expandedGroups,
        [group]: !expandedGroups[group],
      });
    }
  };

  // Tooltip dashboard
  const handleIconMouseEnter = (e, name) => {
    if (!isSidebarOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const relativeY = rect.top - sidebarRect.top + rect.height / 2;
      setTooltipInfo({
        show: true,
        text: name,
        y: relativeY,
      });
    }
  };
  const handleIconMouseLeave = () => {
    setTooltipInfo({ show: false, text: "", y: 0 });
  };

  // Dropdown subgrup
  const handleGroupMouseEnter = (groupId, e) => {
    if (!isSidebarOpen) {
      clearTimeout(hoverTimeoutRef.current);
      const rect = e.currentTarget.getBoundingClientRect();
      const sidebarWidth = sidebarRef.current?.clientWidth || 0;
      setDropdownPosition({
        top: rect.top + window.scrollY,
        left: sidebarWidth + 8,
      });
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredGroup(groupId);
      }, 100);
    }
  };
  const handleGroupMouseLeave = () => {
    if (!isSidebarOpen) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredGroup(null);
      }, 300);
    }
  };
  const handleDropdownMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
  };
  const handleDropdownMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredGroup(null);
    }, 200);
  };

  // Data menu
  const DASHBOARD_LINKS = [
    { name: "Overview", icon: BarChart2, href: "/" },
    { name: "Analytics", icon: TrendingUp, href: "/analytics" },
    { name: "Calendar", icon: Calendar, href: "/calendar" },
  ];
  const SIDEBAR_GROUPS = [
    {
      id: "finance",
      title: "Keuangan",
      icon: DollarSign,
      items: [
        { name: "Dashboard Keuangan", icon: DollarSign, href: "/finance" },
        { name: "Transaksi", icon: FileSpreadsheet, href: "/finance/transactions" },
        { name: "Laporan", icon: FileText, href: "/finance/reports" },
      ],
    },
    {
      id: "secretariat",
      title: "Kesekretariatan",
      icon: Mail,
      items: [
        { name: "Surat Masuk", icon: Mail, href: "/secretariat/incoming" },
        { name: "Surat Keluar", icon: Send, href: "/secretariat/outgoing" },
        { name: "Arsip Surat", icon: Archive, href: "/secretariat/archive" },
        { name: "Template Surat", icon: FileText, href: "/secretariat/templates" },
        { name: "Disposisi", icon: Clipboard, href: "/secretariat/disposition" },
      ],
    },
    {
      id: "ecrav",
      title: "ECRAV",
      icon: ShoppingBag,
      items: [
        { name: "Produk", icon: ShoppingBag, href: "/ecrav/products" },
        { name: "Penjualan", icon: DollarSign, href: "/ecrav/sales" },
        { name: "Pesanan", icon: ShoppingCart, href: "/ecrav/orders" },
        { name: "Inventaris", icon: FileSpreadsheet, href: "/ecrav/inventory" },
      ],
    },
    {
      id: "cmi",
      title: "CMI",
      icon: Instagram,
      items: [
        { name: "Analisis Sosial Media", icon: PieChart, href: "/cmi/social-analytics" },
        { name: "Instagram", icon: Instagram, href: "/cmi/instagram" },
        { name: "YouTube", icon: Youtube, href: "/cmi/youtube" },
        { name: "Content Calendar", icon: Calendar, href: "/cmi/content-calendar" },
        { name: "Campaign", icon: Target, href: "/cmi/campaigns" },
      ],
    },
    {
      id: "pod",
      title: "POD",
      icon: Book,
      items: [
        { name: "Data Mahasiswa", icon: Users, href: "/pod/students" },
        { name: "Absensi", icon: UserCheck, href: "/pod/attendance" },
        { name: "Program Pendidikan", icon: Award, href: "/pod/programs" },
      ],
    },
    {
      id: "pr",
      title: "PR",
      icon: Briefcase,
      items: [
        { name: "Sponsor", icon: Gift, href: "/pr/sponsors" },
        { name: "Event PR", icon: Calendar, href: "/pr/events" },
        { name: "Partnership", icon: Briefcase, href: "/pr/partnerships" },
        { name: "Media Coverage", icon: Tv, href: "/pr/media" },
      ],
    },
    {
      id: "management",
      title: "Manajemen",
      icon: Settings,
      items: [
        { name: "Anggota", icon: Users, href: "/management/members" },
        { name: "Roles & Permissions", icon: UserPlus, href: "/management/roles" },
        { name: "Pengaturan", icon: Settings, href: "/settings" },
      ],
    },
  ];

  return (
    <div className="relative">
      <motion.div
        className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 h-screen ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 64 }}
      >
        <div
          ref={sidebarRef}
          className="h-full bg-blue-950 bg-opacity-50 backdrop-blur-md p-3 flex flex-col border-r border-blue-700 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent"
        >
          <div className="flex items-center justify-between mb-6">
            {isSidebarOpen && (
              <motion.h1
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Digcity
              </motion.h1>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-full hover:bg-blue-700 hover:bg-opacity-55 transition-colors ${
                !isSidebarOpen ? "mx-auto" : ""
              }`}
            >
              {isSidebarOpen ? (
                <ChevronsLeft size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </motion.button>
          </div>

          <hr className="my-3 border-blue-700 opacity-50" />

          {/* Dashboard Links */}
          <div className="mb-4 space-y-1">
            {DASHBOARD_LINKS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <motion.div
                    className={`flex items-center p-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-30 transition-colors ${
                      isActive ? "bg-blue-700 bg-opacity-50 sidebar-active" : ""
                    } ${!isSidebarOpen ? "justify-center" : ""}`}
                    whileHover={isSidebarOpen ? { x: 4 } : { scale: 1.1 }}
                    onMouseEnter={(e) =>
                      !isSidebarOpen && handleIconMouseEnter(e, item.name)
                    }
                    onMouseLeave={handleIconMouseLeave}
                  >
                    <item.icon
                      size={20}
                      className={`${
                        isActive ? "text-blue-300" : "text-gray-400"
                      } ${!isSidebarOpen ? "mx-auto" : "min-w-[20px]"}`}
                    />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className={`ml-3 text-sm font-medium ${
                            isActive ? "text-white" : "text-gray-300"
                          }`}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <hr className="my-3 border-blue-700 opacity-50" />

          <nav className="mt-2 flex-grow space-y-1">
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.id} className="mb-2 relative">
                <button
                  onClick={() => toggleGroup(group.id)}
                  onMouseEnter={(e) => handleGroupMouseEnter(group.id, e)}
                  onMouseLeave={handleGroupMouseLeave}
                  className={`w-full flex items-center p-2 rounded-lg ${
                    expandedGroups[group.id]
                      ? "bg-blue-800 bg-opacity-50"
                      : "hover:bg-blue-700 hover:bg-opacity-30"
                  } transition-colors mb-1 ${
                    !isSidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <group.icon
                    size={20}
                    className={`text-blue-300 ${
                      !isSidebarOpen ? "mx-auto" : "min-w-[20px]"
                    }`}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.div
                        className="flex flex-grow items-center justify-between"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="ml-3 text-sm font-medium text-gray-100">
                          {group.title}
                        </span>
                        {expandedGroups[group.id] ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {isSidebarOpen && expandedGroups[group.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2 pl-4 border-l border-blue-700 space-y-1"
                    >
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link key={item.href} to={item.href}>
                            <motion.div
                              className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-lg transition-colors my-1 hover:bg-blue-700 hover:bg-opacity-30 ${
                                isActive
                                  ? "bg-blue-700 bg-opacity-50 sidebar-active"
                                  : ""
                              }`}
                              whileHover={{ x: 4 }}
                            >
                              <item.icon
                                size={16}
                                className={`${
                                  isActive ? "text-blue-300" : "text-gray-400"
                                } min-w-[16px]`}
                              />
                              <span
                                className={`ml-3 ${
                                  isActive ? "text-white" : "text-gray-300"
                                }`}
                              >
                                {item.name}
                              </span>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Dropdown subgrup portal */}
                <AnimatePresence>
                  {!isSidebarOpen &&
                    hoveredGroup === group.id &&
                    typeof window !== "undefined" &&
                    createPortal(
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[9999] bg-blue-900 rounded-md shadow-lg py-2 min-w-[180px]"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="px-2 py-1 mb-1 border-b border-blue-800">
                          <h4 className="text-sm font-semibold text-blue-200">
                            {group.title}
                          </h4>
                        </div>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block"
                              onClick={() => setHoveredGroup(null)}
                            >
                              <div className="flex items-center px-3 py-2 text-sm text-blue-200 hover:bg-blue-700 rounded-md mx-1 my-0.5 transition-colors">
                                <item.icon size={16} className="min-w-[16px]" />
                                <span className="ml-3">{item.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>,
                      document.body
                    )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-auto pt-4 border-t border-blue-700 text-xs text-gray-500 text-center"
            >
              Organization Smart System v1.0
            </motion.div>
          )}
        </div>
      </motion.div>
      {/* Tooltip dashboard */}
      <AnimatePresence>
        {!isSidebarOpen && tooltipInfo.show && (
          <motion.div
            className="absolute z-50 px-3 py-2 bg-blue-800 text-white rounded-md shadow-lg text-sm font-medium whitespace-nowrap"
            style={{
              left: "100%",
              top: `${tooltipInfo.y}px`,
              transform: "translateY(-50%)",
              marginLeft: "8px",
            }}
          >
            {tooltipInfo.text}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-blue-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
