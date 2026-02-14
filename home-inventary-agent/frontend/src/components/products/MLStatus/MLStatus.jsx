import React, { useState } from 'react';
import { Bot, RotateCw, CheckCircle2, AlertTriangle, Activity, BrainCircuit } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const MLStatus = () => {
    const [isTraining, setIsTraining] = useState(false);

    // Static chart data
    const accuracyData = [
        { epoch: '1', accuracy: 0.65 },
        { epoch: '2', accuracy: 0.72 },
        { epoch: '3', accuracy: 0.78 },
        { epoch: '4', accuracy: 0.82 },
        { epoch: '5', accuracy: 0.85 },
        { epoch: '6', accuracy: 0.89 },
        { epoch: '7', accuracy: 0.92 },
    ];

    const modelMetrics = [
        { subject: 'Precision', A: 92, fullMark: 100 },
        { subject: 'Recall', A: 88, fullMark: 100 },
        { subject: 'F1-Score', A: 90, fullMark: 100 },
        { subject: 'Speed', A: 95, fullMark: 100 },
        { subject: 'Gen-Quality', A: 85, fullMark: 100 },
    ];

    const handleRetrain = () => {
        setIsTraining(true);
        setTimeout(() => setIsTraining(false), 3000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Machine Learning Status</h1>
                    <p className="text-brown-500 mt-1">Model health, training metrics, and prediction capabilities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold border border-green-200">
                        <CheckCircle2 className="w-4 h-4" /> Model Active
                    </span>
                    <button
                        onClick={handleRetrain}
                        disabled={isTraining}
                        className="flex items-center gap-2 px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg shadow-md transition-all disabled:opacity-50"
                    >
                        <RotateCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
                        {isTraining ? 'Training...' : 'Retrain Model'}
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard title="Model Version" value="v2.4.5" subtext="Deployed 12h ago" icon={Bot} />
                <StatusCard title="Last Training Accuracy" value="94.2%" subtext="+1.5% from v2.4.4" icon={Activity} />
                <StatusCard title="Total Predictions" value="12,450" subtext="In last 30 days" icon={BrainCircuit} />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Training Accuracy Chart */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Training Convergence</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={accuracyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" />
                                <XAxis dataKey="epoch" stroke="#5d4037" label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fill: '#5d4037' }} />
                                <YAxis stroke="#5d4037" domain={[0.5, 1]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                />
                                <Line type="monotone" dataKey="accuracy" stroke="#5d4037" strokeWidth={3} dot={{ stroke: '#5d4037', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Radar */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Model Metrics Profile</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={modelMetrics}>
                                <PolarGrid stroke="#e5dec3" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5d4037', fontSize: 12, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#e5dec3" />
                                <Radar name="Model v2.4.5" dataKey="A" stroke="#5d4037" fill="#8d6e63" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Training Logs */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-4">System Logs</h3>
                <div className="bg-black/5 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto text-brown-800 space-y-2 border border-beige-200">
                    <p><span className="text-brown-500">[14:30:22]</span> INFO: Model loaded successfully.</p>
                    <p><span className="text-brown-500">[14:32:05]</span> INFO: Received prediction request for item SKU-992.</p>
                    <p><span className="text-brown-500">[14:32:06]</span> SUCCESS: Prediction generated in 45ms.</p>
                    <p><span className="text-brown-500">[15:00:00]</span> INFO: Scheduled health check passed.</p>
                    <p><span className="text-brown-500">[15:45:12]</span> WARN: High latency detected on GPU worker #2.</p>
                    <p><span className="text-brown-500">[15:45:15]</span> INFO: Optimized query routing engaged.</p>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, subtext, icon: Icon }) => (
    <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-brown-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-brown-900">{value}</h3>
            <p className="text-brown-400 text-xs mt-1">{subtext}</p>
        </div>
        <div className="p-3 rounded-full bg-beige-100 text-brown-600">
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export default MLStatus;
