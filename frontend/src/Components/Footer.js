
function Footer() {
    return (
        <>
            <footer className="bg-neutral-800">
                <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
    
                    <div
                        className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-8 lg:pt-16 text-center"
                    >
                        <div>
                            <p className="font-medium text-white">Design & Developed by:</p>

                            <ul className="mt-6 space-y-4 text-sm">
                                <li>
                                    <a href="#" className="text-white transition hover:opacity-75"> Lakshit Rajput (20220030) </a>
                                </li>

                                <li>
                                    <a href="#" className="text-white transition hover:opacity-75"> Saurabh Gupta (20224133) </a>
                                </li>

                                <li>
                                    <a href="#" className="text-white transition hover:opacity-75"> Electronics and Communication Engineering </a>
                                </li>

                                <li>
                                    <a href="#" className="text-white transition hover:opacity-75"> Motilal Nehru National Institute of Technology, Allahabad </a>
                                </li>

                            </ul>
                        </div>
                        <hr/>
                        {/* <p className="text-xs text-white">&copy; 2025. All rights reserved.</p> */}

                    </div>

                </div>
            </footer>
        </>
    )
}

export default Footer;