
import React from 'react';

const Header: React.FC = () => {
  return <header className="bg-ns-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/314a9556-eb7d-46b1-b7ef-02045d0b9794.png" 
            alt="NS Logo" 
            className="h-8 mr-3"
          />
        </div>
        <h1 className="text-xl font-bold">Multimodal Planner</h1>
      </div>
      <div className="text-sm">
        Emmeloord → Den Haag
      </div>
    </header>;
};

export default Header;
