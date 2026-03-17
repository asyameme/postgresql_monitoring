import { LEVELS } from '../data/levels';
import type { ProgressRingsProps } from '../types';

export function ProgressRings({ currentLevel }: ProgressRingsProps) {
  return (
    <div className="relative w-44 h-44 mx-auto">
      {LEVELS.map((item, index) => {
        const size = 176 - index * 26;
        const isActive = index === currentLevel;
        const isPassed = index < currentLevel;

        return (
          <div
            key={item.id}
            className={`absolute rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              isActive
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : isPassed
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-white'
            }`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${(176 - size) / 2}px`,
              left: `${(176 - size) / 2}px`
            }}
            aria-label={`Уровень ${item.id}`}
            title={item.title}
          >
            <span className={`text-xs font-bold ${isActive ? 'text-blue-700' : isPassed ? 'text-emerald-700' : 'text-slate-500'}`}>
              {item.id}
            </span>
          </div>
        );
      })}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xl text-center leading-tight px-2">
          PostgreSQL
        </div>
      </div>
    </div>
  );
}
