
function Navbar() {
    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-neutral-800 z-50">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                    <a className="block text-green-600" href="#">
                        <span>IMAGE FORGERY</span>
                    </a>

                    <div className="flex flex-1 items-center justify-end md:justify-between">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                <li>
                                    <a className="text-white transition hover:text-white/75" href="#home"> Home </a>
                                </li>

                                <li>
                                    <a className="text-white transition hover:text-white/75" href="#feature"> Feature </a>
                                </li>

                                <li>
                                    <a className="text-white transition hover:text-white/75" href="#about"> About </a>
                                </li>

                            </ul>
                        </nav>

                        <div className="flex items-center gap-4">

                            <button
                                className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar;