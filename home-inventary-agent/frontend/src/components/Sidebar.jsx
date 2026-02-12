import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Building2, BarChart3, Bot, Hexagon, 
    ChevronLeft, ChevronRight, Plus, Receipt, ArrowLeftRight, Mic
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const links = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/inventory', label: 'Inventory', icon: Package },
        { path: '/warehouses', label: 'Warehouses', icon: Building2 },
        { path: '/billing', label: 'Billing & Invoices', icon: Receipt },
        { path: '/movement', label: 'Stock Movement', icon: ArrowLeftRight },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/agent', label: 'AI Agent', icon: Bot },
        { path: '/voice', label: 'Voice Command', icon: Mic }, 
    ];

    return (
        <div 
            className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 flex flex-col z-50 shadow-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20 px-3' : 'w-64 px-5'}`}
        >
            {/* 1. FIXED HEADER (Logo & Toggle) - Does not scroll */}
            <div className={`mt-5 mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative shrink-0`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative flex items-center justify-center shrink-0">
                        <Hexagon className="text-emerald-400 w-8 h-8 relative z-10" strokeWidth={2.5} />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full"></div>
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-[700] text-white tracking-wide animate-in fade-in duration-300">
                            InventAI
                        </span>
                    )}
                </div>
                
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`absolute ${isCollapsed ? '-right-6 top-10 bg-slate-800 border border-slate-700' : 'right-0'} p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 z-50`}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* 2. SCROLLABLE CONTENT AREA - This part scrolls independently */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-4">
                <nav className="flex flex-col gap-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                title={isCollapsed ? link.label : ""}
                                className={`flex items-center gap-3 py-2.5 rounded-xl text-[14px] font-[500] transition-all duration-300 ease-out group ${
                                    isCollapsed ? 'justify-center px-0' : 'px-3'
                                } ${
                                    active
                                        ? 'bg-emerald-500/10 text-white border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transparent border border-transparent'
                                }`}
                            >
                                <Icon 
                                    className={`shrink-0 transition-colors duration-300 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${active ? 'text-emerald-400 drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-300'}`} 
                                    strokeWidth={active ? 2.5 : 2} 
                                />
                                {!isCollapsed && <span className="animate-in fade-in duration-300 truncate">{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* QUICK ACTIONS INSIDE SCROLL AREA */}
                {!isCollapsed && (
                    <div className="mt-8 animate-in fade-in duration-300">
                        <h4 className="text-[11px] font-[700] text-slate-500 uppercase tracking-wider mb-2 px-3">Quick Actions</h4>
                        <div className="flex flex-col gap-1">
                            <Link to="/inventory" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-[500] text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200 group">
                                <Plus className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" /> Add Item
                            </Link>
                            <Link to="/billing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-[500] text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200 group">
                                <Receipt className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" /> Create Bill
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. FIXED FOOTER (Profile) - Does not scroll */}
            <div className={`mt-auto pt-4 pb-4 border-t border-slate-800/60 shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform">AD</div>
                    {!isCollapsed && (
                        <div className="flex flex-col truncate animate-in fade-in duration-300">
                            <span className="text-sm font-[600] text-white leading-tight truncate">Admin User</span>
                            <span className="text-[11px] text-slate-400 font-[500] truncate">System Admin</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;