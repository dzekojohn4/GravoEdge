import React from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ArrowUpDown, Bug } from 'lucide-react';

const Leaderboard = () => {
  const stats = {
    usdcPosition: 48390048,
    ethPosition: 2930,
    strgPosition: 89002039,
  };

  const leaderboardData = [
    { id: 1, name: '0x2326cE85ff591f2aBC3f5c2559...', positions: 98 },
    { id: 2, name: '0x5294cE85ff591f2aBC3f5c7893...', positions: 96 },
    { id: 3, name: '0x7754cE85ff591f2aBC3f5c2893...', positions: 95 },
    { id: 4, name: '0x9924cE85ff591f2aBC3f5c2893...', positions: 94 },
    { id: 5, name: '0x1124cE85ff591f2aBC3f5c2893...', positions: 93 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">zkLend Leaderboard</h1>
          <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Bug size={18} />
            <span className="text-sm">Report Bug</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <section className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <div className="text-sm text-gray-400">USDC Position</div>
              <div className="text-xl font-bold">{stats.usdcPosition.toLocaleString()}</div>
            </div>
          </section>

          <section className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <div className="text-sm text-gray-400">ETH Position</div>
              <div className="text-xl font-bold">{stats.ethPosition.toLocaleString()}</div>
            </div>
          </section>

          <section className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <div className="text-sm text-gray-400">STRG Position</div>
              <div className="text-xl font-bold">{stats.strgPosition.toLocaleString()}</div>
            </div>
          </section>
        </div>

        {/* Leaderboard Table */}
        <section className="bg-gray-800 border-gray-700">
          <div className="border-b border-gray-700">
            <h2 className="text-xl font-bold">Leaderboard</h2>
          </div>
          <div>
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left py-4">Name</th>
                  <th className="text-left py-4">Opened Positions</th>
                  <th className="text-left py-4">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="py-4">{item.name}</td>
                    <td className="py-4">{item.positions}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <ArrowUpDown size={18} className="text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leaderboard;
