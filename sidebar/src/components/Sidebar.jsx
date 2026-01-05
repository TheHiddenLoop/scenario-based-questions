function Sidebar({setSidebar}) {
    return (
        <div className="h-screen bg-green-800 text-white flex flex-col p-4">

            <div className="flex items-center justify-between">
                <div className="text-2xl font-bold mb-8">
                    MyApp
                </div>
                <div onClick={setSidebar} className="text-2xl font-bold mb-8">
                    X
                </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-white text-green-500 flex items-center justify-center font-bold">
                    A
                </div>
                <div>
                    <p className="font-semibold">Angesh Chauhan</p>
                    <p className="text-sm opacity-80">MERN Developer</p>
                </div>
            </div>

            <nav className="flex flex-col gap-3">
                <button className="text-left px-3 py-2 rounded hover:bg-green-500 transition">
                    Dashboard
                </button>
                <button className="text-left px-3 py-2 rounded hover:bg-green-500 transition">
                    Projects
                </button>
                <button className="text-left px-3 py-2 rounded hover:bg-green-500 transition">
                    Messages
                </button>
                <button className="text-left px-3 py-2 rounded hover:bg-green-500 transition">
                    Settings
                </button>
            </nav>

            <div className="flex-1"></div>

            <button className="px-3 py-2 rounded bg-green-600 hover:bg-green-700 transition">
                Logout
            </button>
        </div>
    )
}

export default Sidebar
