
import React from 'react';
import { Train } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-ns-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-ns-yellow rounded-sm p-1 flex items-center justify-center">
          <span className="text-ns-blue font-bold text-xl">NS</span>
        </div>
        <h1 className="text-xl font-bold">Multimodal Planner</h1>
      </div>
      <div className="text-sm">
        Emmeloord → Den Haag
      </div>
    </header>
  );
};

export default Header;
