import { useState, useEffect } from 'react';
import { Table, Button, Select, Popconfirm, message, Tag, Spin } from 'antd';
import { DeleteOutlined, PhoneOutlined, WhatsAppOutlined, MailOutlined, DownloadOutlined, UsergroupAddOutlined, FireOutlined, BankOutlined, RiseOutlined } from '@ant-design/icons';
import { request } from '../../services/apiClient';
import * as XLSX from 'xlsx';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const { Option } = Select;

const StatCard = ({ title, value, icon, gradient, delay }: { title: string, value: string | number, icon: React.ReactNode, gradient: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl relative overflow-hidden group shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2">{title}</p>
        <h3 className="text-4xl font-serif italic text-white tracking-wide font-normal">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [eventFilter, setEventFilter] = useState('All');
  const [exporting, setExporting] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const limit = 50;

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await request('/register/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch stats', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRegistrations = async (currentPage: number, filter: string) => {
    setLoading(true);
    try {
      const res = await request(`/register?page=${currentPage}&limit=${limit}&event=${filter === 'All' ? '' : filter}`);
      if (res.success) {
        setData(res.data);
        setTotal(res.total);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRegistrations(page, eventFilter);
  }, [page, eventFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await request(`/register/${id}`, { method: 'DELETE' });
      if (res.success) {
        message.success('Registration deleted');
        fetchRegistrations(page, eventFilter);
        fetchStats(); // Refresh stats
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await request(`/register/export?event=${eventFilter === 'All' ? '' : eventFilter}`);
      if (res.success && res.data.length > 0) {
        const excelData = res.data.map((item: any) => ({
          Name: item.name,
          Email: item.email,
          Phone: item.phone,
          WhatsApp: item.whatsapp,
          College: item.college,
          Department: item.department,
          Year: item.year,
          Event: item.eventName,
          RegisteredAt: new Date(item.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        const fileName = `Registrations_${eventFilter === 'All' ? 'AllEvents' : eventFilter.replace(/\s+/g, '')}_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(workbook, fileName);
        message.success('Download started');
      } else {
        message.warning('No data found to export');
      }
    } catch (error: any) {
      message.error(error.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'College', dataIndex: 'college', key: 'college' },
    { 
      title: 'Event', 
      dataIndex: 'eventName', 
      key: 'eventName',
      render: (text: string) => <Tag color="green" className="bg-green-500/10 border-green-500/20 text-green-400 px-3 py-1 rounded-full">{text}</Tag>
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <a href={`tel:${record.phone}`} title="Call">
            <Button type="default" shape="circle" icon={<PhoneOutlined />} size="small" className="bg-white/5 border-white/10 hover:border-white/30 text-white" />
          </a>
          <a href={`https://wa.me/${record.whatsapp}`} target="_blank" rel="noreferrer" title="WhatsApp">
            <Button type="default" shape="circle" icon={<WhatsAppOutlined />} size="small" className="bg-green-500/10 border-green-500/30 hover:border-green-500 text-green-500" />
          </a>
          <a href={`mailto:${record.email}`} title="Email">
            <Button type="default" shape="circle" icon={<MailOutlined />} size="small" className="bg-white/5 border-white/10 hover:border-white/30 text-white" />
          </a>
          <Popconfirm
            title="Delete the registration"
            description="Are you sure to delete this application?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger shape="circle" icon={<DeleteOutlined />} size="small" className="hover:!bg-red-500/20 !border-transparent hover:!text-red-400" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-xl">
          <p className="text-zinc-400 text-xs font-bold uppercase mb-1">{label}</p>
          <p className="text-white text-lg font-serif italic m-0">{payload[0].value} Registrations</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10 font-sans">
      
      {/* Dashboard KPI Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-serif italic text-white m-0 tracking-wide">Overview</h1>
          <p className="text-zinc-400 mt-2 text-sm">Real-time statistics and insights.</p>
        </div>
      </div>

      {/* KPI Cards */}
      {statsLoading && !stats ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Entries" 
            value={stats.totalRegistrations} 
            icon={<UsergroupAddOutlined />} 
            gradient="from-green-500 to-emerald-500"
            delay={0.1}
          />
          <StatCard 
            title="Today's Growth" 
            value={stats.todayRegistrations > 0 ? `+${stats.todayRegistrations}` : '0'} 
            icon={<RiseOutlined />} 
            gradient="from-blue-500 to-indigo-500"
            delay={0.2}
          />
          <StatCard 
            title="Top Event" 
            value={stats.eventDistribution?.[0]?.name || 'N/A'} 
            icon={<FireOutlined />} 
            gradient="from-orange-500 to-red-500"
            delay={0.3}
          />
          <StatCard 
            title="Top College" 
            value={stats.topColleges?.[0]?.name || 'N/A'} 
            icon={<BankOutlined />} 
            gradient="from-purple-500 to-pink-500"
            delay={0.4}
          />
        </div>
      ) : null}

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl shadow-2xl"
          >
            <h3 className="text-lg font-serif italic text-white mb-6 tracking-wide">Activity Timeline</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.timeline}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Event Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl shadow-2xl"
          >
            <h3 className="text-lg font-serif italic text-white mb-6 tracking-wide">Event Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.eventDistribution} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {
                      stats.eventDistribution.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'][index % 5]} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Registrations Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl mt-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif italic text-white m-0 tracking-wide">Registrations Database</h2>
            <p className="text-zinc-400 mt-1 text-sm">Manage all incoming applications.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Select
              value={eventFilter}
              onChange={(val) => {
                setEventFilter(val);
                setPage(1); 
              }}
              className="dark-select w-full sm:w-[200px]"
              popupClassName="dark-dropdown"
              size="large"
            >
              <Option value="All">All Events</Option>
              <Option value="Terrarium Making Workshop">Terrarium Making Workshop</Option>
              <Option value="Vegetable Printing">Vegetable Printing</Option>
              <Option value="Treasure Hunt">Treasure Hunt</Option>
              <Option value="The Big Quiz">The Big Quiz</Option>
              <Option value="The Ecological Debate">The Ecological Debate</Option>
            </Select>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={exporting}
              size="large"
              className="w-full sm:w-auto !bg-gradient-to-r !from-green-600 !to-emerald-500 hover:!from-green-500 hover:!to-emerald-400 !border-none !text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Export to Excel
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-zinc-950/30">
          <Table
            dataSource={data}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: total,
              onChange: (newPage) => setPage(newPage),
              showSizeChanger: false,
              position: ['bottomCenter'],
              className: 'pb-4'
            }}
            className="dark-table"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
