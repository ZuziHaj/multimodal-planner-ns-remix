
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-ns-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/8ccbf5ae-eed8-4be9-9e68-20b7e02bc399.png" 
            alt="NS logo" 
            className="h-8 w-auto"
          />
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
