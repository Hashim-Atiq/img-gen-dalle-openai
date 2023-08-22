import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });

    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);

                const response = await fetch("http://127.0.0.1:8000/img_gen/generate_image",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt: form.prompt }),
                    })

                const data = await response.json();

                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
            }

            catch (err) {
                alert(err);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert("Please enter a valid prompt.")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.prompt && form.photo) {
            setLoading(true);

            try {
                const response = await fetch("http://127.0.0.1:8000/img_gen/add_gallery", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                })

                await response.json();
                navigate('/');
            } catch (err) {
                alert(err);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter a valid prompt and generate an image first.")
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    }

    return (
        <section className="max-w-4xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Generate Image</h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
            </div>

            <form className="mt-16 max-w-4xl mb-6" onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        labelName="Your Name"
                        type="text"
                        name="name"
                        placeholder="Ex., john doe"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="A synthwave style sunset above the reflecting water of the sea, digital art…"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className='flex w-full justify-center'>
                        <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-96 p-3 h-96 flex justify-center items-center">
                            {form.photo ? (
                                <img
                                    src={form.photo}
                                    alt={form.prompt}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-9/12 h-9/12 object-contain opacity-40"
                                />
                            )}

                            {generatingImg && (
                                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                    <Loader />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className=" text-white bg-green-700 font-medium rounded-md text-sm w-full md:w-full xl:w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {loading ? 'Sharing...' : 'Share with the Community'}
                    </button>
                </div>
            </form>
        </section >
    )
}

export default CreatePost