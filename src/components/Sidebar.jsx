import { BarChart2, ShoppingBag, Users, DollarSign, ShoppingCart, TrendingUp, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#ffffff", path: "/"},
  { name: "Products", icon: ShoppingBag, color: "#ffffff", href: "/products" },
  { name: "Users", icon: Users, color: "#ffffff", href: "/users" },
  { name: "Sales", icon: DollarSign, color: "#ffffff", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#ffffff", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#ffffff", href: "/analytics" },
  { name: "Settings", icon: Settings, color: "#ffffff", href: "/settings" },
];
const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }
    `}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='h-full bg-blue-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-blue-700'>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 rounded-full hover:bg-gray-700 hover:bg-opacity-55 transition-colors max-w-fit'
        >
          <Menu size={24} />
        </motion.button>
        <nav className='mt-8 flex-grow'>
            {SIDEBAR_ITEMS.map((item, index) => (
                <Link key={item.href} to={item.href}>
                    <motion.div
                    className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mb-2'
                    >
                        <item.icon size={20} style={{color: item.color, minWidth: "20px"}} />

                    
                    </motion.div>
                </Link>
            ))}

        </nav>

      </div>
    </motion.div>
  );
};

export default Sidebar;
