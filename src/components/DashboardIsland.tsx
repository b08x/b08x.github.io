import React, { useState } from 'react';
import { Activity, GitCommit, GitPullRequest, Star, Box, Cpu, HardDrive, Clock, Search } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ElementType;
}
// https://gemini.google.com/app/ae08ffc1ab95c967
const StatCard = ({ title, value, change, changeType, icon: Icon }: StatCardProps) => (
    <div className="bg-gray-900 border border-gray-800 p-4 hover:border-emerald-500/50 transition-colors group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="mt-1 text-2xl font-mono font-bold text-gray-100">{value}</h3>
            </div>
            <div className="p-1.5 bg-gray-800 rounded group-hover:bg-gray-700 transition-colors">
                <Icon className="w-4 h-4 text-emerald-400" />
            </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-mono">
            <span className={`px-1.5 py-0.5 rounded ${changeType === 'positive' ? 'bg-emerald-950 text-emerald-400' :
                changeType === 'negative' ? 'bg-red-950 text-red-400' :
                    'bg-gray-800 text-gray-400'
                }`}>
                {change}
            </span>
            <span className="ml-2 text-gray-600">vs last 30d</span>
        </div>
    </div>
);

const ActivityItem = ({ title, time, type }: { title: string, time: string, type: 'commit' | 'pr' | 'issue' }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors px-2 -mx-2">
        <div className={`mt-1 w-1.5 h-1.5 rounded-sm ${type === 'commit' ? 'bg-blue-500' :
            type === 'pr' ? 'bg-purple-500' :
                'bg-emerald-500'
            }`} />
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300 font-mono truncate">{title}</p>
                <span className="text-xs text-gray-600 font-mono whitespace-nowrap ml-2">{time}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-mono text-gray-500 bg-gray-900 border border-gray-800 px-1 rounded">
                    {type}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                    {type === 'commit' ? 'a1b2c3d' : type === 'pr' ? '#124' : '#892'}
                </span>
            </div>
        </div>
    </div>
);

interface DashboardProps {
    title?: string;
    description?: string;
}

const DashboardIsland = ({ title, description }: DashboardProps) => {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="space-y-6 font-mono text-sm">
            {/* Header Section */}
            <div className="flex items-end justify-between border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{title || 'Dashboard'}</h1>
                    <p className="mt-2 text-gray-400">{description || 'System overview and metrics'}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all text-xs">
                        <Clock className="w-3 h-3" />
                        <span>History</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/50 transition-all text-xs">
                        <Search className="w-3 h-3" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Commits"
                    value="1,284"
                    change="+12.5%"
                    changeType="positive"
                    icon={GitCommit}
                />
                <StatCard
                    title="Issues"
                    value="34"
                    change="-2.1%"
                    changeType="positive"
                    icon={Activity}
                />
                <StatCard
                    title="PRs"
                    value="12"
                    change="+4.3%"
                    changeType="neutral"
                    icon={GitPullRequest}
                />
                <StatCard
                    title="Stars"
                    value="8.4k"
                    change="+18.2%"
                    changeType="positive"
                    icon={Star}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Activity Graph</h3>
                        <div className="flex border border-gray-800 rounded-sm">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-xs font-mono transition-all ${timeRange === range
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mock Graph */}
                    <div className="h-64 flex items-end justify-between gap-1 mt-4 border-b border-l border-gray-800 p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')]">
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((h, i) => (
                            <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className="w-full bg-emerald-900/40 border-t border-x border-emerald-500/30 hover:bg-emerald-500/20 transition-all relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                    Value: {h}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Recent Events</h3>
                    <div className="flex flex-col">
                        <ActivityItem title="docs: update API ref" time="2h" type="commit" />
                        <ActivityItem title="fix: mobile nav" time="4h" type="pr" />
                        <ActivityItem title="feat: dark mode" time="1d" type="issue" />
                        <ActivityItem title="refactor: dashboard" time="2d" type="commit" />
                        <ActivityItem title="chore: deps update" time="3d" type="pr" />
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-mono text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 transition-colors uppercase tracking-wider">
                        View Log
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="pt-6 border-t border-gray-800">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { name: 'omega-13', status: 'Active', icon: HardDrive, desc: 'Voice recording stream' },
                        { name: 'video-chapter-automater', status: 'Processing', icon: Cpu, desc: 'GPU pipeline' },
                        { name: 'b08x.github.io', status: 'Deployed', icon: Box, desc: 'Digital garden' }
                    ].map((project) => (
                        <div key={project.name} className="bg-gray-900 border border-gray-800 p-4 hover:border-gray-600 transition-all cursor-pointer group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded text-gray-400 group-hover:text-emerald-400 group-hover:bg-gray-800 transition-colors">
                                        <project.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-200 group-hover:text-white">{project.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{project.desc}</p>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full mt-2 ${project.status === 'Active' ? 'bg-emerald-500' : project.status === 'Deployed' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardIsland;