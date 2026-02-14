import React from 'react';
import { Code, Key, Server, Database, Lock } from 'lucide-react';

const ApiDocsPage = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-brown-600 rounded-lg text-white">
                        <Code className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-brown-900">Developer API</h1>
                </div>
                <p className="text-brown-600 text-lg max-w-2xl">
                    Integrate AIVENTORY's predictive engine directly into your ERP.
                    Enterprise-grade endpoints with 99.9% uptime SLA.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Main Docs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Authentication Section */}
                    <div className="glass-panel p-8 rounded-2xl border border-beige-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-6 h-6 text-brown-600" />
                            <h2 className="text-2xl font-bold text-brown-900">Authentication</h2>
                        </div>
                        <p className="text-brown-600 mb-6">
                            All API requests must be authenticated using a Bearer token in the header.
                            You can generate API keys in your admin dashboard.
                        </p>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-sm font-mono text-emerald-400">
                                Authorization: Bearer sk_live_51M...
                            </code>
                        </div>
                    </div>

                    {/* Endpoint: Get Inventory */}
                    <div className="glass-panel p-8 rounded-2xl border border-beige-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="w-6 h-6 text-brown-600" />
                            <h2 className="text-2xl font-bold text-brown-900">Endpoints</h2>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-mono text-xs font-bold font-sans">GET</span>
                                <code className="text-brown-800 font-mono text-lg">/api/v1/inventory</code>
                            </div>
                            <p className="text-brown-600 mb-4">
                                Retrieves a paginated list of inventory items with current stock levels and predicted depletion dates.
                            </p>

                            <h4 className="text-sm font-bold text-brown-500 uppercase tracking-wider mb-3">Example Response</h4>
                            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                    {`{
  "data": [
    {
      "id": "prod_8x92nm",
      "name": "Ergonomic Office Chair",
      "stock_level": 84,
      "status": "healthy",
      "prediction": {
        "depletion_date": "2026-03-15",
        "confidence": 0.94
      }
    }
  ],
  "meta": {
    "total_items": 1245,
    "page": 1,
    "limit": 20
  }
}`}
                                </pre>
                            </div>
                        </div>

                        <div className="border-t border-beige-200 pt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md font-mono text-xs font-bold font-sans">POST</span>
                                <code className="text-brown-800 font-mono text-lg">/api/v1/forecast</code>
                            </div>
                            <p className="text-brown-600 mb-4">
                                Trigger a real-time demand forecast for a specific category.
                            </p>
                            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                    {`// Body
{
  "category_id": "cat_furniture",
  "horizon_days": 30
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Meta Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-beige-200">
                        <h3 className="font-bold text-brown-900 mb-4 flex items-center gap-2">
                            <Key className="w-5 h-5 text-brown-500" /> API Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brown-600">Environment</span>
                                <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Production</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brown-600">Version</span>
                                <span className="font-mono text-brown-900">v1.2.4</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brown-600">Uptime (30d)</span>
                                <span className="font-mono text-brown-900">99.98%</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-beige-200 bg-brown-900 text-white">
                        <h3 className="font-bold mb-2">Need a Sandbox?</h3>
                        <p className="text-brown-200 text-sm mb-4">
                            Test your integrations safely with our dedicated sandbox environment. Does not affect live data.
                        </p>
                        <button className="w-full py-2 bg-white text-brown-900 rounded-lg font-medium hover:bg-beige-100 transition-colors text-sm">
                            Request Sandbox Access
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-beige-200 text-center text-brown-400 text-sm">
                <p>&copy; 2026 AIVENTORY Inc. API Terms of Use apply.</p>
            </div>
        </div>
    );
};

export default ApiDocsPage;
