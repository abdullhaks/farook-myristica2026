import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Dropdown, message, Modal, Button } from 'antd';
import { UserOutlined, LogoutOutlined, KeyOutlined, DownOutlined, LockOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../store/useAdminStore';
import { request } from '../../services/apiClient';

export default function AdminLayout() {
  const navigate = useNavigate();
  const setLogout = useAdminStore((state) => state.setLogout);
  const adminUser = useAdminStore((state) => state.adminUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await request('/admin/logout', { method: 'POST' });
      setLogout();
      navigate('/admin');
      message.success('Logged out successfully');
    } catch (error) {
      // Even if API fails, clear local state
      setLogout();
      navigate('/admin');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      message.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res) {
        message.success('Password changed successfully');
        setIsModalOpen(false);
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Change Password',
      icon: <KeyOutlined />,
      onClick: () => setIsModalOpen(true),
    },
    {
      key: '2',
      danger: true,
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Admin Navbar */}
      <nav className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 group">
            <img 
              src="/Myristica_Icon.png" 
              alt="Myristica Logo" 
              className="h-8 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="flex items-baseline gap-2">
              <span className="font-serif italic text-lg font-normal tracking-wide text-white">
                Myristica
              </span>
              <span className="text-xs font-semibold tracking-[2px] uppercase text-green-500">
                Admin
              </span>
            </div>
          </Link>

          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <UserOutlined />
              </div>
              <span className="font-medium">{adminUser?.username || 'Admin'}</span>
              <DownOutlined className="text-xs text-zinc-400" />
            </div>
          </Dropdown>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      <Modal
        title={
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950/50 border border-white/10 flex items-center justify-center shadow-inner">
              <KeyOutlined className="text-green-500 text-xl" />
            </div>
            <span className="text-2xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 font-normal tracking-wide">
              Security
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="dark-modal font-sans"
        closeIcon={
          <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-300">
            <span className="text-white/70 hover:text-white text-lg leading-none mt-[-2px]">✕</span>
          </div>
        }
        styles={{
          mask: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          body: { 
            backgroundColor: 'rgba(24, 24, 27, 0.4)', 
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2.5rem',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
            textAlign: 'center'
          },
          header: { backgroundColor: 'transparent', borderBottom: 'none', marginBottom: '8px' }
        }}
      >
        <div className="space-y-5 mt-4">
          <div className="relative group text-left">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-green-400 transition-colors z-10">
              <LockOutlined />
            </div>
            <input
              type="password"
              placeholder="Current Passcode"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/10 text-white placeholder-zinc-500 h-14 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="relative group text-left">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-green-400 transition-colors z-10">
              <KeyOutlined />
            </div>
            <input
              type="password"
              placeholder="New Passcode"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/10 text-white placeholder-zinc-500 h-14 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-inner"
            />
          </div>

          <Button
            type="primary"
            loading={loading}
            onClick={handleChangePassword}
            className="w-full !bg-gradient-to-r !from-green-600 !to-emerald-500 hover:!from-green-500 hover:!to-emerald-400 !text-white !border-none h-14 text-sm font-bold tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 mt-6 relative group overflow-hidden flex items-center justify-center"
          >
            <span className="relative z-10">{loading ? 'UPDATING...' : 'UPDATE PASSWORD'}</span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
