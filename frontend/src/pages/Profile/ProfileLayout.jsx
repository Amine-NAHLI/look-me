import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import toast from 'react-hot-toast';

const ProfileLayout = () => {
  const { user, logout } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'LM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { label: 'Mes Commandes', path: '/profil/commandes', icon: <ShoppingBag size={20} strokeWidth={1.5} /> },
    { label: 'Mes Informations', path: '/profil/informations', icon: <User size={20} strokeWidth={1.5} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-32">
              
              {/* User Identity */}
              <div className="flex flex-col items-center mb-10 pb-10 border-b border-gray-50">
                <div className="w-20 h-20 bg-pink-50 text-[#C2185B] rounded-[2rem] flex items-center justify-center text-2xl font-heading font-bold mb-5 shadow-inner">
                  {getInitials(user?.firstName)}
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-1">{user?.firstName}</h2>
                <p className="text-sm font-body text-gray-400">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                        isActive 
                        ? 'bg-[#C2185B]/5 text-[#C2185B] border-l-[3px] border-[#C2185B] font-bold' 
                        : 'text-gray-500 hover:bg-gray-50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-4">
                      <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                      <span className="font-body text-sm tracking-wide">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </NavLink>
                ))}

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-body text-sm mt-4 group"
                >
                  <LogOut size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium tracking-wide">Déconnexion</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Page Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
