import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: BarChart3 },
  { label: 'Blogs', path: '/admin/blogs', icon: FileText },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="pt-16 min-h-screen bg-[#f7f8ff]">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className={`fixed md:static z-50 md:z-auto top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-[#151249] text-white p-6 transition-transform ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold">CMS Admin</h2>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-yellow-400 text-[#151249] font-bold' : 'hover:bg-white/10'}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="md:hidden px-4 py-3 border-b border-gray-200 bg-white sticky top-16 z-40 flex justify-between items-center">
            <h3 className="font-bold text-[#151249]">Admin Panel</h3>
            <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-lg border border-gray-200">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <main className="p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
