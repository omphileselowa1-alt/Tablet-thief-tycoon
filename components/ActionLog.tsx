import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ActionLogProps {
  logs: LogEntry[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm shadow-xl">
      <h3 className="text-gray-400 font-bold mb-2 sticky top-0 bg-black/80 py-1">ACTIVITY LOG</h3>
      <div className="space-y-1">
        {logs.length === 0 && <span className="text-gray-600 italic">No activity yet. Start stealing!</span>}
        {logs.map((log) => (
          <div key={log.id} className={`
            ${log.type === 'success' ? 'text-green-400' : ''}
            ${log.type === 'failure' ? 'text-red-400' : ''}
            ${log.type === 'info' ? 'text-blue-300' : ''}
            ${log.type === 'event' ? 'text-yellow-400 font-bold' : ''}
          `}>
            <span className="opacity-50 text-xs mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ActionLog;
