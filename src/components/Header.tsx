
import React from 'react';
import { Train } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <Train className="h-6 w-6" />
        <h1 className="text-xl font-bold">NS Multimodal Planner</h1>
      </div>
      <div className="text-sm">
        Bunschoten → Den Haag
      </div>
    </header>
  );
};

export default Header;
