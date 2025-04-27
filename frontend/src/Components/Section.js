import { useState } from "react";

function Section() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [processedImages, setProcessedImages] = useState({ 
        heatmap: null, 
        final: null,
        error: null
    });
    const [loading, setLoading] = useState(false);
    const [operation, setOperation] = useState("");

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
            setFile(selectedFile);
            setProcessedImages({ heatmap: null, final: null, error: null });
            setOperation("");
        }
    };

    const handleOperation = async (op) => {
        if (!file) {
            setProcessedImages(prev => ({...prev, error: 'Please select an image first'}));
            return;
        }
        
        setOperation(op);
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('operation', op);

        try {
            const response = await fetch('http://localhost:4000/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                setProcessedImages(prev => ({...prev, error: data.error}));
            } else {
                console.log(data.finalOutput);
                setProcessedImages({
                    heatmap: `data:image/png;base64,${data.heatmap}`,
                    final: `data:image/png;base64,${data.finalOutput}`,
                    error: null
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setProcessedImages(prev => ({...prev, error: error.message}));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="pt-12 pb-6">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
                    
                    {/* Left Side: Upload Image + Buttons */}
                    <div>
                        <div className="p-4">
                            <label className="inline-block cursor-pointer rounded bg-rose-500 px-4 py-2 text-white font-bold hover:bg-rose-600">
                                Select Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {preview && (
                                <div className="mt-4 space-y-4">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="max-w-full rounded-lg shadow-lg" 
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleOperation('copy-move')}
                                            disabled={loading}
                                            className={`rounded px-4 py-2 text-white font-bold ${
                                                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        >
                                            {loading && operation === 'copy-move' ? (
                                                'Processing...'
                                            ) : (
                                                'Copy-Move Detection'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleOperation('slicing')}
                                            disabled={loading}
                                            className={`rounded px-4 py-2 text-white font-bold ${
                                                loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                        >
                                            {loading && operation === 'slicing' ? (
                                                'Processing...'
                                            ) : (
                                                'Splicing Detection'
                                            )}
                                        </button>
                                    </div>

                                    {processedImages.error && (
                                        <p className="text-red-500">{processedImages.error}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Processed Images */}
                    <div className="space-y-8">
                        {processedImages.heatmap ? (
                            <>
                                <div>
                                    <h2 className="mb-2 text-xl font-bold text-gray-800">
                                        {operation === 'slicing' ? 'ELA Heatmap' : 'Keypoint Detection'}
                                    </h2>
                                    <img
                                        src={processedImages.heatmap}
                                        alt="Heatmap"
                                        className="w-full rounded-lg shadow-lg border border-gray-200"
                                    />
                                </div>

                                <div>
                                    <h2 className="mb-2 text-xl font-bold text-gray-800">
                                        {operation === 'slicing' ? 'Tampered Regions' : 'Copy-Move Detection'}
                                    </h2>
                                    <img
                                        src={processedImages.final}
                                        alt="Final Output"
                                        className="w-full rounded-lg shadow-lg border border-gray-200"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <img
                                    src="https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE="
                                    alt="Placeholder"
                                    className="w-64 rounded-lg shadow-lg opacity-50"
                                />
                                <p className="mt-4 text-gray-500">
                                    {preview ? 'Select an operation to process the image' : 'Upload an image to begin analysis'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section;