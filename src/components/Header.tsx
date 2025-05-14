
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-ns-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/2cc0595a-747d-4ddc-bb9f-47a4d9e578fd.png" 
            alt="NS logo" 
            className="h-10 w-auto bg-ns-yellow p-1 rounded-sm"
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
