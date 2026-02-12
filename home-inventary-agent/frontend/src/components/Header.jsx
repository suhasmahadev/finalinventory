import { Moon, Sun, Bell } from 'lucide-react';

// Added 'isCollapsed' prop to calculate width correctly
const Header = ({ title, toggleTheme, isDarkMode, isCollapsed }) => {
    return (
        <header 
            className={`h-20 fixed top-0 right-0 z-40 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}
        >
            
            {/* Signature Top Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>

            <h1 className="hidden md:block text-2xl font-[700] tracking-tight text-slate-800 dark:text-slate-100 m-0 transition-colors duration-300">
                {title}
            </h1>

            <div className="flex items-center gap-5">
                <button onClick={toggleTheme} className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-700 shadow-sm hover:shadow transition-all duration-300 focus:outline-none">
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-700 shadow-sm hover:shadow transition-all duration-300 relative focus:outline-none">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </button>

                <div className="w-10 h-10 ml-2 rounded-full bg-slate-800 dark:bg-slate-700 border-2 border-transparent hover:border-emerald-400/50 flex items-center justify-center text-sm font-[600] text-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                    AD
                </div>
            </div>
        </header>
    );
};

export default Header;