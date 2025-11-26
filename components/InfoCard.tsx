import React from 'react';

interface InfoCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  warning?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, icon, warning }) => {
  return (
    <div className={`p-5 rounded-2xl mb-4 backdrop-blur-md border border-white/40 shadow-lg ${warning ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center mb-3">
        {icon && <div className="ml-2 text-2xl">{icon}</div>}
        <h3 className={`text-lg font-bold ${warning ? 'text-red-700' : 'text-gray-900'}`}>{title}</h3>
      </div>
      <div className="text-sm leading-7 opacity-90 whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};

export default InfoCard;