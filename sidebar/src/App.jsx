import React, { useState } from 'react'
import Sidebar from './components/Sidebar'

function App() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="flex h-screen relative overflow-hidden">
      
      <div
        className={`
          w-[290px]
          absolute left-0 top-0 h-full
          bg-gray-800
          z-50
          transition-transform duration-300
          ${sidebar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar setSidebar={()=>setSidebar(!sidebar)}/>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded z-10"
          onClick={() => setSidebar(!sidebar)}
        >
          Toggle Sidebar
        </button>
      </div>
    </div>
  )
}

export default App
