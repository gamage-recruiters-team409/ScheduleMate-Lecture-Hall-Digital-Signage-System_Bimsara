import { useState } from 'react';
import { fullLabFloors, largeHallFloors } from '../../data/mockData';
import { FloorTypeBadge } from '../ui/StatusBadge';

export default function BuildingManagement() {
  const [activeBuilding, setActiveBuilding] = useState<'main' | 'new'>('main');
  const [activeSide, setActiveSide] = useState<string>('A');

  const buildings = [
    { id: 'main' as const, name: 'Main Building', code: 'MB', floors: 10, sides: ['A', 'B'], rooms: 48, desc: 'Floors 1–10, A & B Sides' },
    { id: 'new' as const, name: 'New Building', code: 'NB', floors: 14, sides: ['G', 'F'], rooms: 62, desc: 'Floors 1–14, G & F Sides' },
  ];

  const current = buildings.find(b => b.id === activeBuilding)!;

  const getFloorType = (floor: number): 'standard' | 'full-lab' | 'large-hall' => {
    if ((largeHallFloors[activeBuilding] ?? []).includes(floor)) return 'large-hall';
    if (fullLabFloors[activeBuilding].includes(floor)) return 'full-lab';
    return 'standard';
  };

  const sides = activeBuilding === 'main' ? ['A', 'B'] : ['G', 'F'];
  if (!sides.includes(activeSide)) setActiveSide(sides[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Locations</h2>
          <p className="text-sm text-slate-500">Building, floor and side configuration</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
          <span>+</span> Add Building
        </button>
      </div>

      {/* Building selector */}
      <div className="grid grid-cols-2 gap-4">
        {buildings.map(b => (
          <button
            key={b.id}
            onClick={() => { setActiveBuilding(b.id); setActiveSide(b.sides[0]); }}
            className={`rounded-xl border-2 p-5 text-left transition-all ${activeBuilding === b.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`flex size-10 items-center justify-center rounded-lg font-800 text-sm ${activeBuilding === b.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {b.code}
              </div>
              {activeBuilding === b.id && (
                <span className="text-[10px] font-700 uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Selected</span>
              )}
            </div>
            <h3 className="font-700 text-slate-900">{b.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-[11px] text-slate-500"><span className="font-700 text-slate-800">{b.floors}</span> Floors</span>
              <span className="text-[11px] text-slate-500"><span className="font-700 text-slate-800">{b.rooms}</span> Rooms</span>
              <span className="text-[11px] text-slate-500"><span className="font-700 text-slate-800">{b.sides.join(' & ')}</span> Sides</span>
            </div>
          </button>
        ))}
      </div>

      {/* Floor list */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-700 text-slate-900">{current.name} – Floor Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">{current.floors} floors · Viewing {activeSide} Side</p>
          </div>
          {/* Side tabs */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {sides.map(side => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                className={`px-4 py-1.5 text-sm font-600 transition-colors ${activeSide === side ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {side} Side
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-2.5 rounded-sm bg-slate-200 inline-block" /> Standard Floor
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-2.5 rounded-sm bg-purple-200 inline-block" /> Full Lab Floor
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-2.5 rounded-sm bg-orange-200 inline-block" /> Large Lecture Hall
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {Array.from({ length: current.floors }, (_, i) => current.floors - i).map(floor => {
            const type = getFloorType(floor);
            return (
              <div
                key={floor}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition-colors ${type === 'full-lab' ? 'bg-purple-50/30' : type === 'large-hall' ? 'bg-orange-50/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex size-8 items-center justify-center rounded-lg text-sm font-700 ${type === 'standard' ? 'bg-slate-100 text-slate-700' : type === 'full-lab' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                    {floor}
                  </span>
                  <div>
                    <p className="text-sm font-600 text-slate-900">Floor {floor} – {activeSide} Side</p>
                    <p className="text-xs text-slate-400 font-mono">{current.code}-{String(floor).padStart(2, '0')}{activeSide}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FloorTypeBadge type={type} />
                  <div className="flex gap-1.5">
                    <button className="rounded px-2.5 py-1 text-xs font-600 text-blue-600 hover:bg-blue-50 transition-colors">Edit</button>
                    <button className="rounded px-2.5 py-1 text-xs font-600 text-slate-500 hover:bg-slate-100 transition-colors">Rooms</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
