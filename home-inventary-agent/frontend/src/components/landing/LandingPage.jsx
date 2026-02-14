import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Bot,
    BarChart3,
    Smartphone,
    ShieldCheck,
    Zap,
    Globe,
    CheckCircle2,
    Cpu
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-beige-50 font-sans text-brown-900 selection:bg-brown-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-beige-50/80 backdrop-blur-md border-b border-beige-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-brown-600 to-brown-800 rounded-lg text-white shadow-lg">
                            <Bot className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brown-900 to-brown-600">
                            AIVENTORY
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-brown-600 font-medium">
                        <a href="#features" className="hover:text-brown-900 transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-brown-900 transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-brown-900 transition-colors">Pricing</a>
                        <Link to="/dashboard" className="px-5 py-2.5 bg-brown-900 text-beige-50 rounded-full hover:bg-brown-800 hover:text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                            Enter Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 opacity-30 pointer-events-none">
                    <div className="w-[800px] h-[800px] bg-brown-200 rounded-full blur-3xl absolute -top-40 -right-40 animate-pulse"></div>
                    <div className="w-[600px] h-[600px] bg-beige-300 rounded-full blur-3xl absolute top-40 right-40"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-beige-200 shadow-sm backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="text-sm font-semibold text-brown-600">v2.4.0 – Stable Release</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-brown-900">
                            Inventory Management <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brown-600 to-brown-400">
                                Reimagined with AI.
                            </span>
                        </h1>
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium text-brown-900">
                                Built for retailers, SMEs, and multi-location businesses.
                            </h2>
                            <p className="text-lg text-brown-800 max-w-lg leading-relaxed font-medium">
                                Stop guessing. Start knowing. AIVENTORY uses advanced machine learning to predict demand, optimize stock levels, and automate your logistics.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/dashboard" className="px-8 py-4 bg-brown-900 text-white rounded-xl font-bold text-lg hover:bg-brown-800 hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="px-8 py-4 bg-transparent text-brown-900 rounded-xl font-bold text-lg border-2 border-brown-200 hover:bg-brown-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                                Watch Demo
                            </button>
                        </div>

                        {/* Metrics Strip */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-brown-100">
                            <div>
                                <p className="text-2xl font-bold text-brown-900">98%</p>
                                <p className="text-sm text-brown-700 font-bold">Forecast Accuracy</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-brown-900">45%</p>
                                <p className="text-sm text-brown-700 font-bold">Faster Decisions</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-brown-900">Real-Time</p>
                                <p className="text-sm text-brown-700 font-bold">Multi-Warehouse Sync</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual/Dashboard Preview */}
                    <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                        <div className="relative w-full max-w-lg aspect-square bg-gradient-to-br from-brown-100 to-beige-100 rounded-3xl rotate-3 shadow-2xl border border-white/50 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                            {/* Abstract UI Representation */}
                            <div className="absolute inset-4 bg-white/40 rounded-2xl border border-white/60 shadow-inner flex flex-col p-6 space-y-4">
                                {/* Header Mock */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                        <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-2 w-20 bg-brown-900/10 rounded-full"></div>
                                </div>

                                <div className="flex gap-4 h-1/3">
                                    {/* Left Card: Bar Chart Mock */}
                                    <div className="w-1/2 bg-white/60 rounded-xl border border-white/50 p-4 flex flex-col justify-between shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-12 bg-brown-900/20 rounded-full"></div>
                                                <div className="text-lg font-bold text-brown-800">$12,450</div>
                                            </div>
                                            <div className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">+12%</div>
                                        </div>
                                        <div className="flex items-end justify-between h-12 gap-1 mt-2">
                                            <div className="w-full bg-brown-800/20 rounded-t-sm h-[40%]"></div>
                                            <div className="w-full bg-brown-800/40 rounded-t-sm h-[70%]"></div>
                                            <div className="w-full bg-brown-800/30 rounded-t-sm h-[50%]"></div>
                                            <div className="w-full bg-brown-600 rounded-t-sm h-[85%]"></div>
                                        </div>
                                    </div>

                                    {/* Right Card: List Mock */}
                                    <div className="w-1/2 bg-white/60 rounded-xl border border-white/50 p-4 flex flex-col gap-3 shadow-sm justify-center">
                                        {[
                                            { label: 'Electronics', val: '45%' },
                                            { label: 'Furniture', val: '32%' },
                                            { label: 'Clothing', val: '23%' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-brown-100 text-brown-700' : 'bg-beige-100 text-brown-600'}`}>
                                                    {item.label[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-[10px] font-medium text-brown-700 mb-1">
                                                        <span>{item.label}</span>
                                                        <span>{item.val}</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-brown-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brown-500 rounded-full" style={{ width: item.val }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Chart Area */}
                                <div className="flex-1 bg-gradient-to-t from-brown-500/5 to-transparent rounded-xl border border-brown-500/10 relative overflow-hidden p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-brown-600">Revenue Overview</span>
                                        <span className="text-[10px] bg-white/50 px-2 py-1 rounded text-brown-500">Last 30 Days</span>
                                    </div>

                                    <div className="relative flex-1">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                                            <div className="border-t border-brown-900 border-dashed w-full"></div>
                                            <div className="border-t border-brown-900 border-dashed w-full"></div>
                                            <div className="border-t border-brown-900 border-dashed w-full"></div>
                                        </div>

                                        {/* Fake Chart Lines */}
                                        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 50" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#8d6e63" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#8d6e63" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0 50 L 0 35 L 20 25 L 40 30 L 60 15 L 80 20 L 100 5 L 100 50 Z" fill="url(#chartGradient)" />
                                            <path d="M0 35 L 20 25 L 40 30 L 60 15 L 80 20 L 100 5" fill="none" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        {/* Data Points */}
                                        <div className="absolute top-[10%] left-[60%] bg-brown-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                                            $8.4k
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-xl border border-beige-100 animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-brown-400 font-bold uppercase tracking-wider">Efficiency</p>
                                    <p className="text-lg font-bold text-brown-900">+45%</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-10 -right-5 bg-white p-4 rounded-xl shadow-xl border border-beige-100 animate-bounce-slow delay-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-brown-400 font-bold uppercase tracking-wider">AI Insight</p>
                                    <p className="text-sm font-bold text-brown-900">Stock Low: Chair</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-beige-100/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl font-bold text-brown-900">Intelligent Architecture</h2>
                        <p className="text-brown-700 font-medium">From raw data to actionable insights in milliseconds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brown-200 via-brown-400 to-brown-200 border-t-2 border-dashed border-brown-300 z-0"></div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg border border-beige-200 flex items-center justify-center">
                                <Globe className="w-10 h-10 text-brown-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brown-900 mb-2">1. Data Collection</h3>
                                <p className="text-brown-700 text-sm leading-relaxed px-4 font-medium">
                                    Syncs real-time data from warehouses, POS systems, and suppliers.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg border border-beige-200 flex items-center justify-center">
                                <Cpu className="w-10 h-10 text-brown-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brown-900 mb-2">2. AI Analysis</h3>
                                <p className="text-brown-700 text-sm leading-relaxed px-4 font-medium">
                                    NLP engine processes queries and predictive models forecast demand.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg border border-beige-200 flex items-center justify-center">
                                <Zap className="w-10 h-10 text-brown-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brown-900 mb-2">3. Smart Decisions</h3>
                                <p className="text-brown-700 text-sm leading-relaxed px-4 font-medium">
                                    Instant alerts for low stock, reorder suggestions, and automated reporting.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl font-bold text-brown-900">Powerful features for modern business.</h2>
                        <p className="text-lg text-brown-500">Everything you need to manage your inventory, from predictive analytics to automated reordering.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Bot}
                            title="AI-Powered Agent"
                            description="Ask questions about your stock in plain English. Our AI agent understands context and provides real-time answers."
                            to="/agent"
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Predictive Analytics"
                            description="Forecast demand before it happens. Visualize trends with beautiful, interactive charts powered by recharts."
                            to="/analytics"
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Multi-Location Support"
                            description="Manage multiple warehouses and zones seamlessly. Track movement between locations with ease."
                            to="/warehouse"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Enterprise Security"
                            description="Role-based access control and encrypted data storage keep your business intelligence safe."
                            to="/"
                        />
                        <FeatureCard
                            icon={Smartphone}
                            title="Mobile Optimized"
                            description="Access your dashboard from anywhere. Fully responsive design that works on all devices."
                            to="/"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Sync"
                            description="Real-time updates across all clients. Never miss a stock movement or sale."
                            to="/movement"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-beige-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-brown-900">Simple, transparent pricing.</h2>
                        <p className="text-lg text-brown-600">Choose the plan that fits your business scale.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter */}
                        <div className="p-8 rounded-2xl bg-white border border-beige-200 shadow-sm hover:shadow-xl transition-all">
                            <h3 className="text-xl font-bold text-brown-900 mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-brown-900 mb-4">$0<span className="text-lg font-normal text-brown-500">/mo</span></div>
                            <p className="text-brown-500 mb-6 text-sm">Perfect for small businesses just getting started.</p>
                            <ul className="space-y-3 mb-8 text-brown-700 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Up to 500 SKUs</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic Analytics</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 1 Warehouse</li>
                            </ul>
                            <Link to="/" className="block w-full py-3 px-4 bg-brown-100 text-brown-700 rounded-xl font-bold text-center hover:bg-brown-200 transition-colors">Get Started</Link>
                        </div>

                        {/* Pro */}
                        <div className="p-8 rounded-2xl bg-brown-900 text-white shadow-xl transform md:-translate-y-4 border border-brown-700 relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <div className="text-4xl font-bold text-white mb-4">$49<span className="text-lg font-normal text-brown-300">/mo</span></div>
                            <p className="text-brown-300 mb-6 text-sm">For growing businesses with multiple locations.</p>
                            <ul className="space-y-3 mb-8 text-brown-100 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Unlimited SKUs</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> AI Demand Forecasting</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> 5 Warehouses</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> API Access</li>
                            </ul>
                            <Link to="/" className="block w-full py-3 px-4 bg-white text-brown-900 rounded-xl font-bold text-center hover:bg-beige-100 transition-colors">Start Free Trial</Link>
                        </div>

                        {/* Enterprise */}
                        <div className="p-8 rounded-2xl bg-white border border-beige-200 shadow-sm hover:shadow-xl transition-all">
                            <h3 className="text-xl font-bold text-brown-900 mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold text-brown-900 mb-4">Custom</div>
                            <p className="text-brown-500 mb-6 text-sm">For large-scale operations requiring dedicated support.</p>
                            <ul className="space-y-3 mb-8 text-brown-700 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited Everything</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom AI Models</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                            </ul>
                            <Link to="/" className="block w-full py-3 px-4 bg-brown-100 text-brown-700 rounded-xl font-bold text-center hover:bg-brown-200 transition-colors">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brown-900 text-beige-100 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-white group">
                            <Bot className="w-6 h-6 group-hover:text-brown-200 transition-colors" />
                            <span className="text-xl font-bold">AIVENTORY</span>
                        </Link>
                        <p className="text-brown-200 text-sm leading-relaxed">
                            Empowering businesses with intelligent inventory solutions. Built for the future of commerce.
                        </p>
                        <div className="pt-4 space-y-2">
                            <div className="text-xs text-brown-300 font-mono bg-brown-800/50 p-2 rounded border border-brown-700">
                                Built with React, Node.js, NLP-based AI Engine
                            </div>
                            <div className="flex items-center gap-2 text-xs text-green-400">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Enterprise-grade security.</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-3 text-beige-100/80 text-sm">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><Link to="/api" className="hover:text-white transition-colors">API Documentation</Link></li>
                            <li><Link to="/ml-status" className="hover:text-white transition-colors">ML Status</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-beige-100/80 text-sm">
                            <li><Link to="/architecture" className="hover:text-white transition-colors">Architecture</Link></li>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                            <li><a href="mailto:contact@ainventory.com" className="hover:text-white transition-colors">Contact Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-3 text-beige-100/80 text-sm">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><span className="text-brown-500 cursor-not-allowed">Cookie Policy</span></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-brown-800 text-center text-brown-400 text-sm">
                    &copy; 2026 AIVENTORY Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, to }) => (
    <Link to={to} className="block p-8 rounded-2xl bg-beige-50 border border-beige-100 hover:border-brown-200 hover:shadow-xl transition-all group">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brown-600 mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-brown-900 mb-3 group-hover:text-brown-600 transition-colors flex items-center justify-between">
            {title}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>
        <p className="text-brown-700 leading-relaxed font-medium">
            {description}
        </p>
    </Link>
);

export default LandingPage;
