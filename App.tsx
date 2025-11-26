import React, { useState, useEffect } from 'react';
import { fetchTehranAQI } from './services/geminiService';
import { AQIData, AQILevel } from './types';
import Gauge from './components/Gauge';
import InfoCard from './components/InfoCard';

const App: React.FC = () => {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTehranAQI();
      setData(result);
    } catch (err) {
      setError("خطا در دریافت اطلاعات. لطفا اتصال اینترنت یا کلید API را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isHighRisk = (level: AQILevel) => {
    return [AQILevel.Unhealthy, AQILevel.VeryUnhealthy, AQILevel.Hazardous].includes(level);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:h-auto sm:my-8 sm:rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
        
        {/* Header Background based on status */}
        <div className={`absolute top-0 w-full h-64 rounded-b-[3rem] transition-colors duration-500 z-0
          ${loading ? 'bg-blue-400' : 
            data?.level === AQILevel.Good ? 'bg-green-100' :
            data?.level === AQILevel.Moderate ? 'bg-yellow-100' :
            data?.level === AQILevel.UnhealthySensitive ? 'bg-orange-100' :
            'bg-red-100'
          }`} 
        />

        <div className="relative z-10 px-6 py-8 flex-1 flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-black text-gray-800">هوای تهران</h1>
              <p className="text-sm text-gray-500 mt-1">
                {loading ? 'در حال بررسی...' : data?.lastUpdated}
              </p>
            </div>
            <button 
              onClick={loadData} 
              disabled={loading}
              className="bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 text-gray-700 ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                <p className="text-gray-500 animate-pulse">در حال دریافت اطلاعات از ماهواره...</p>
              </div>
            ) : error ? (
              <div className="text-center mt-12 bg-red-50 p-6 rounded-2xl border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="text-red-700 font-bold mb-2">خطا</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : data ? (
              <>
                <Gauge aqi={data.aqi} level={data.level} />

                {isHighRisk(data.level) && (
                  <div className="animate-pulse mb-6">
                    <InfoCard 
                      warning={true}
                      title="هشدار جدی!"
                      content="هوای امروز برای سلامتی خطرناک است. لطفاً تا حد امکان از خانه خارج نشوید و پنجره‌ها را بسته نگه دارید."
                      icon={<span>⚠️</span>}
                    />
                  </div>
                )}

                <div className="space-y-4 pb-8">
                  <InfoCard 
                    title="توضیحات" 
                    content={data.summary} 
                    icon={<span>📝</span>}
                  />
                </div>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;