import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface LogProps {
  messages: Message[];
}

const Log: React.FC<LogProps> = ({ messages }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={logRef} className="flex-1 overflow-y-auto bg-[#0f0f23] border border-gray-800 rounded-lg p-3.5 flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`msg leading-relaxed p-2.5 px-3.5 rounded-lg text-[0.93rem] border-l-3 ${
            msg.type === 'ai' ? 'bg-[#16213e] border-[#c9a84c] text-gray-200' :
            msg.type === 'player' ? 'bg-[#1e3a2f] border-[#4caf8a] text-[#cceedd] text-right' :
            msg.type === 'system' ? 'bg-[#2a1a1a] border-[#444] text-gray-500 text-[0.78rem] font-mono' :
            msg.type === 'whisper' ? 'bg-[#1a1a2a] border-[#c9a84c] text-[#c9a84c] italic text-[0.85rem]' :
            msg.type === 'world-voice' ? 'bg-[#0f1a2a] border-[#6080c0] text-[#9ab0d0] italic text-[0.8rem]' :
            msg.type === 'demon' ? 'bg-[#2a0a0a] border-[#e05050] text-[#ffaaaa]' :
            msg.type === 'generation' ? 'bg-[#2a2200] border-[#e0a050] text-[#ffe090]' :
            'bg-[#1a2a1a] border-[#4a8a4a] text-[#90e090] text-[0.85rem]'
          }`}
        >
          {msg.turn != null && <div className="text-[0.7rem] text-gray-500 mb-1">Turn {msg.turn}</div>}
          {msg.type === 'world-voice' ? (
            <>
              <div className="text-[0.7rem] text-[#6080c0] mb-1 tracking-wider">── 世界の声 ──</div>
              <p>「{msg.text}」</p>
              <div className="text-[0.7rem] text-[#6080c0] mt-1 text-right">— {msg.speaker}</div>
            </>
          ) : (
            <p>{msg.text}</p>
          )}
          {msg.dice && <div className="text-[0.68rem] text-gray-400 mt-1 font-mono">{msg.dice}</div>}
        </div>
      ))}
    </div>
  );
};

export default Log;
