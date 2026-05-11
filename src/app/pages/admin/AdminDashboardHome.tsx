import { useEffect, useState } from 'react';
import { FileText, Globe, Layers3, PenSquare } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import type { DashboardStats } from '../../types/cms';

const emptyStats: DashboardStats = {
  totalBlogs: 0,
  publishedBlogs: 0,
  draftBlogs: 0,
  categoriesCount: 0,
};

export function AdminDashboardHome() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const response = await adminApi.getStats(token);
        setStats(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const cards = [
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Published Blogs', value: stats.publishedBlogs, icon: Globe, gradient: 'from-green-500 to-green-600' },
    { title: 'Draft Blogs', value: stats.draftBlogs, icon: PenSquare, gradient: 'from-yellow-500 to-orange-500' },
    { title: 'Categories', value: stats.categoriesCount, icon: Layers3, gradient: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#151249]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Track your blog publishing performance in real time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <h2 className="text-3xl font-bold text-[#151249]">{loading ? '--' : card.value}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
