import React, { useState, useEffect, useMemo } from "react";
import { framer, CanvasNode } from "framer-plugin";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import "./App.css";

framer.showUI({
    position: "top right",
    width: 300,
    height: 600,
});

function useSelection() {
    const [selection, setSelection] = useState<CanvasNode[]>([]);

    useEffect(() => {
        return framer.subscribeToSelection(setSelection);
    }, []);

    return selection;
}

function useAnalyticsData() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulating data fetch - replace with actual data fetching logic
        const mockData = {
            dailyPerformance: [
                { date: '2023-10-01', users: 100, views: 150 },
                { date: '2023-10-02', users: 120, views: 180 },
                { date: '2023-10-03', users: 110, views: 165 },
                { date: '2023-10-04', users: 130, views: 195 },
                { date: '2023-10-05', users: 150, views: 225 },
            ],
            topPages: [
                { path: '/home', views: 500 },
                { path: '/about', views: 300 },
                { path: '/contact', views: 200 },
                { path: '/products', views: 150 },
                { path: '/blog', views: 100 },
            ],
        };
        setData(mockData);
    }, []);

    return data;
}

export function App() {
    const selection = useSelection();
    const data = useAnalyticsData();
    const [metricFocus, setMetricFocus] = useState(null);

    const totalUsers = useMemo(() => 
        data?.dailyPerformance.reduce((sum, day) => sum + day.users, 0) || 0
    , [data]);

    const totalViews = useMemo(() => 
        data?.dailyPerformance.reduce((sum, day) => sum + day.views, 0) || 0
    , [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 p-2 border border-gray-700 rounded">
                    <p className="text-gray-300">{new Date(label).toLocaleDateString()}</p>
                    {payload.map((pld) => (
                        <p key={pld.dataKey} style={{color: pld.color}}>
                            {pld.name}: {pld.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!data) return <div>Loading...</div>;

    return (
        <main className="p-4 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Refix Analytics</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-blue-900 cursor-pointer" onClick={() => setMetricFocus(metricFocus === 'users' ? null : 'users')}>
                    <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-300">{totalUsers}</div>
                        <div className="text-blue-300">Total Users</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-900 cursor-pointer" onClick={() => setMetricFocus(metricFocus === 'views' ? null : 'views')}>
                    <CardContent className="p-4">
                        <div className="text-3xl font-bold text-purple-300">{totalViews}</div>
                        <div className="text-purple-300">Total Views</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6 bg-gray-800">
                <CardContent className="p-4">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.dailyPerformance}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                                stroke="#888888"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {(!metricFocus || metricFocus === 'users') && (
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#3B82F6" 
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            )}
                            {(!metricFocus || metricFocus === 'views') && (
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    stroke="#8B5CF6" 
                                    fillOpacity={1} 
                                    fill="url(#colorViews)" 
                                />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="mb-6 bg-gray-800">
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Top Pages</h3>
                    {data.topPages.map((page, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
                            <span>{page.path}</span>
                            <span>{page.views} views</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="secondary">
                    Log Out
                </Button>
                <Button>
                    <Camera className="mr-2 h-4 w-4" /> Take Screenshot
                </Button>
            </div>
        </main>
    );
}