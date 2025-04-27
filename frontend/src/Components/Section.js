import { useState } from "react";

function Section() {

    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <>
            <section className="pt-12 pb-6">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
                        <div>
                            <div className="p-4">
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                
                                {preview && (
                                    <div className="mt-4">
                                        <img src={preview} alt="Preview" className="max-w-xl rounded-lg shadow-lg" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                className="rounded"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Section;