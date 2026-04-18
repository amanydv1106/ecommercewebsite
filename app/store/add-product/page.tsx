// @ts-nocheck
'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useMemo, useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [images, setImages] = useState([])
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState('')
    const [suggestions, setSuggestions] = useState({
        name: [],
        description: []
    })

    const { getToken } = useAuth()

    const imagePreviews = useMemo(
        () => images.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        [images]
    )

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleImageSelection = (e) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (!selectedFiles.length) return
        setImages((prev) => [...prev, ...selectedFiles])
        e.target.value = ''
    }

    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const getAiSuggestions = async (target) => {
        if (!images.length) {
            toast.error('Please upload at least one image first')
            return
        }

        const firstImage = images[0]
        const reader = new FileReader()
        reader.readAsDataURL(firstImage)

        reader.onloadend = async () => {
            const base64String = reader.result?.split(',')[1]
            if (!base64String) {
                toast.error('Unable to read the uploaded image')
                return
            }

            const mimeType = firstImage.type
            const token = await getToken()
            setAiLoading(target)

            try {
                const { data } = await toast.promise(
                    axios.post(
                        '/api/store/ai',
                        {
                            base64Image: base64String,
                            mimeType,
                            target,
                            category: productInfo.category,
                            currentName: productInfo.name,
                            currentDescription: productInfo.description,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    ),
                    {
                        loading: `Generating ${target} suggestions...`,
                        success: `AI suggestions ready for ${target}`,
                        error: (err) => err?.response?.data?.error || err.message,
                    }
                )

                setSuggestions((prev) => ({
                    ...prev,
                    [target]: Array.isArray(data?.suggestions) ? data.suggestions : []
                }))
            } catch (error) {
                console.error(error)
            } finally {
                setAiLoading('')
            }
        }
    }

    const applySuggestion = (field, value) => {
        setProductInfo((prev) => ({
            ...prev,
            [field === 'name' ? 'name' : 'description']: value
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (images.length < 1) {
                return toast.error('Please upload at least one image')
            }
            setLoading(true)

            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)

            images.forEach((image) => {
                formData.append('images', image)
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)

            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "" })
            setImages([])
            setSuggestions({ name: [], description: [] })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <label
                htmlFor="product-images"
                className="mt-4 flex min-h-36 w-full max-w-3xl cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100"
            >
                <Image
                    width={64}
                    height={64}
                    className='mb-4 h-14 w-14'
                    src={assets.upload_area}
                    alt="Upload product images"
                />
                <p className="text-base font-medium text-slate-700">Upload product images</p>
                <input
                    type="file"
                    accept='image/*'
                    id="product-images"
                    onChange={handleImageSelection}
                    multiple
                    hidden
                />
            </label>

            {!!imagePreviews.length && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {imagePreviews.map((image, index) => (
                        <div key={`${image.file.name}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                            <Image
                                width={300}
                                height={300}
                                className='h-32 w-full rounded-lg object-cover'
                                src={image.preview}
                                alt={image.file.name || `Product image ${index + 1}`}
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <label className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <div className="mb-6 w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-medium text-slate-800">AI Suggestions for Product Name</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => getAiSuggestions('name')}
                        disabled={aiLoading === 'name'}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {aiLoading === 'Name' ? 'Generating...' : 'Get Name Suggestions'}
                    </button>
                </div>

                {!!suggestions.name.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {suggestions.name.map((suggestion, index) => (
                            <button
                                key={`${suggestion}-${index}`}
                                type="button"
                                onClick={() => applySuggestion('name', suggestion)}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-left text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="mb-6 w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-medium text-slate-800">AI Suggestions for Description</p>
                        
                    </div>
                    <button
                        type="button"
                        onClick={() => getAiSuggestions('description')}
                        disabled={aiLoading === 'description'}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {aiLoading === 'description' ? 'Generating...' : 'Get Description Suggestions'}
                    </button>
                </div>

                {!!suggestions.description.length && (
                    <div className="mt-4 grid gap-3">
                        {suggestions.description.map((suggestion, index) => (
                            <button
                                key={`${suggestion}-${index}`}
                                type="button"
                                onClick={() => applySuggestion('description', suggestion)}
                                className="rounded-xl border border-slate-300 bg-white p-3 text-left text-sm leading-6 text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2 ">
                    Actual Price (Rs.)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2 ">
                    Offer Price (Rs.)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}
