import React from 'react';
const Header: React.FC = () => {
  return <header className="bg-ns-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img alt="NS logo" className="h-10 w-auto bg-ns-yellow p-1 rounded-sm" src="/lovable-uploads/3eb92e8a-17bb-4f7a-b8cc-a5dc19251f45.png" />
        </div>
        <h1 className="text-xl font-bold">Multimodal Planner</h1>
      </div>
      <div className="text-sm">
        Emmeloord → Den Haag
      </div>
    </header>;
};
export default Header;