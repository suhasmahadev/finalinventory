import React from 'react';
import { Layers, Database, Cpu, Globe, ArrowDown, Activity } from 'lucide-react';

const ArchitecturePage = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-brown-900 mb-4">System Architecture</h1>
                <p className="text-brown-600 text-lg max-w-2xl mx-auto">
                    A high-level overview of the AIVENTORY cloud-native intelligence platform.
                    Built for scale, security, and real-time inference.
                </p>
            </div>

            {/* Diagram Section */}
            <div className="mb-16">
                <div className="glass-panel p-12 rounded-3xl border border-beige-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

                    <div className="flex flex-col items-center gap-8 relative z-10">
                        {/* Frontend */}
                        <div className="w-64 p-6 bg-white rounded-xl shadow-md border border-beige-200 text-center">
                            <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                            <h3 className="font-bold text-brown-900">Client Layer</h3>
                            <p className="text-xs text-brown-500 mt-1">React SPA + Tailwind</p>
                        </div>

                        <ArrowDown className="w-6 h-6 text-brown-300 animate-bounce" />

                        {/* API Gateway */}
                        <div className="w-64 p-6 bg-white rounded-xl shadow-md border border-beige-200 text-center">
                            <Layers className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                            <h3 className="font-bold text-brown-900">API Gateway</h3>
                            <p className="text-xs text-brown-500 mt-1">REST + GraphQL / Auth Guard</p>
                        </div>

                        <div className="h-8 w-0.5 bg-brown-200"></div>

                        {/* Core Services Split */}
                        <div className="flex gap-8 flex-wrap justify-center">
                            {/* AI Engine */}
                            <div className="w-64 p-6 bg-brown-900 text-white rounded-xl shadow-xl border border-brown-700 text-center ring-4 ring-brown-100">
                                <Cpu className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                                <h3 className="font-bold text-white">AI Inference Engine</h3>
                                <p className="text-xs text-brown-300 mt-1">Llama 3 / TensorFlow Serving</p>
                            </div>

                            {/* Database */}
                            <div className="w-64 p-6 bg-white rounded-xl shadow-md border border-beige-200 text-center">
                                <Database className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                <h3 className="font-bold text-brown-900">Data Persistence</h3>
                                <p className="text-xs text-brown-500 mt-1">PostgreSQL + Redis Cache</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold text-brown-900 mb-6 flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-brown-600" />
                        AI Core Mechanics
                    </h2>
                    <div className="space-y-6">
                        <FeatureBlock
                            title="Intent Detection (NLP)"
                            desc="The user query is first processed by a lightweight BERT model to classify intent (e.g., 'Check Stock' vs 'Forecast'). This ensures low latency for common queries."
                        />
                        <FeatureBlock
                            title="Rule-Based Thresholds"
                            desc="Critical alerts (like low stock) use a deterministic rule engine that runs in O(1) time, bypassing the LLM for immediate operational safety."
                        />
                        <FeatureBlock
                            title="Hybrid Forecasting"
                            desc="We combine statistical models (ARIMA) with deep learning (LSTM) to predict stock depletion, weighted by historical accuracy per SKU."
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-brown-900 mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-brown-600" />
                        System Performance
                    </h2>
                    <div className="space-y-6">
                        <FeatureBlock
                            title="Real-time Sync"
                            desc="Inventory updates are pushed via WebSockets, ensuring dashboards reflect warehouse changes within 200ms of occurrence."
                        />
                        <FeatureBlock
                            title="Edge Caching"
                            desc="Static assets and read-heavy API responses are cached at the edge (CDN), reducing global server load by 40%."
                        />
                        <FeatureBlock
                            title="Encryption"
                            desc="All data is encrypted in transit (TLS 1.3) and at rest (AES-256). API keys are hashed using industry-standard argon2."
                        />
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-beige-200 text-center text-brown-400 text-sm">
                <p>System Architecture v2.4 • Confidential & Proprietary</p>
            </div>
        </div>
    );
};

const FeatureBlock = ({ title, desc }) => (
    <div className="pl-4 border-l-2 border-brown-200">
        <h3 className="font-bold text-brown-800 text-lg mb-1">{title}</h3>
        <p className="text-brown-600 leading-relaxed text-sm">{desc}</p>
    </div>
);

export default ArchitecturePage;
