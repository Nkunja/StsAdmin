import React, { useState, useEffect } from 'react';
import ".././AddProducts/AddProducts.css";
import { db, storage } from '../../../Database/config';
import RichTextEditor from 'react-rte';

export default function EditProduct() {
    const [searchQuery, setSearchQuery] = useState("");
    const [productId, setProductId] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        productName: "",
        shortDescription: "",
        shortDescriptionh1: RichTextEditor.createEmptyValue(),
        model: "",
        weighRange: "",
        minWeighCapacity: "",
        maxWeighCapacity: "",
        powerSupply: "",
        batteryEstimatedUseTime: "",
        powerConsumption: "",
        lcdBacklight: "",
        dimensions: "",
        brand: "",
    });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const categories = [
        { id: 1, name: 'WeighBridge', subcategories: ['Axle', 'Concrete', 'Steel'] },
        { id: 2, name: 'Retail Scale', subcategories: ['Price Computing', 'Cash Register', 'Label Printing'] },
        { id: 3, name: 'Industrial Scale', subcategories: ['Platform Scales', 'Floor Scales', 'Hanging Scales', 'Weighing Tanks', 'Pallet truck & scales', 'Animal Scales', 'Monorail Scales', 'Analytical Scales'] },
        { id: 4, name: 'Medical Scales', subcategories: [] },
        { id: 5, name: 'Spares & Accessories', subcategories: ['Load Cells', 'Indicators', 'Cables', 'Leveling Test', 'Batteries', 'Chargers'] },
        { id: 6, name: 'Softwares', subcategories: ['Retail Softwares', 'Weighbridge Softwares'] },
        { id: 7, name: 'POS Hardware', subcategories: ['Terminals', 'Printers', 'Scanners', 'Cash drawers', 'Thermal rolls', 'Thermal labels'] },
        { id: 8, name: 'Counter Scales', subcategories: [] },
        { id: 9, name: 'Analytical Scales', subcategories: [] },
        { id: 10, name: 'Business Automation', subcategories: ['Field Collection System'] },
    ];

    

    useEffect(() => {
        if (productId) {
            db.collection("Products").doc(productId).get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    setProductDetails({
                        productName: data.ProductName,
                        shortDescription: data.ShortDescription,
                        shortDescriptionh1: RichTextEditor.createValueFromString(data.shortdescriptionh1Text || '', 'html'),
                        model: data.model,
                        weighRange: data.weighrange,
                        minWeighCapacity: data.minweighcapacity,
                        maxWeighCapacity: data.maxweighcapacity,
                        powerSupply: data.powersupply,
                        batteryEstimatedUseTime: data.batteryestiamtedusetime,
                        powerConsumption: data.powerconsumption,
                        lcdBacklight: data.lcdbacklight,
                        dimensions: data.dimensions,
                        brand: data.brand,
                    });
                    setSelectedCategory(categories.find(cat => cat.name === data.MainCategory));
                    setSelectedSubcategory(data.SubCategory);
                    setExistingImages(data.productImage || []);
                } else {
                    console.log("No such document!");
                }
            }).catch(error => {
                console.log("Error getting document:", error);
            });
        }
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({...prev, [name]: value}));
    };

    const handleRichTextChange = (value) => {
        setProductDetails(prev => ({...prev, shortDescriptionh1: value}));
    };

    const handleCategoryChange = (event) => {
        const selectedCategoryId = parseInt(event.target.value);
        const selectedCategory = categories.find(category => category.id === selectedCategoryId);
        setSelectedCategory(selectedCategory);
        setSelectedSubcategory(null);
    };

    const handleSubcategoryChange = (event) => {
        setSelectedSubcategory(event.target.value);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prevImages) => [...prevImages, ...files]);
    };

    const handleSearch = () => {
        db.collection("Products").where("ProductName", "==", searchQuery).get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setProductId(doc.id);
                } else {
                    alert("Product not found!");
                }
            })
            .catch(error => {
                console.error("Error searching product: ", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productDetails.productName || !productDetails.shortDescription || !selectedCategory) {
            alert("Please fill all required fields");
            return;
        }

        const updateProduct = (newImageUrls) => {
            const updatedImageUrls = [...existingImages, ...newImageUrls];
            db.collection("Products").doc(productId).update({
                ProductName: productDetails.productName,
                ShortDescription: productDetails.shortDescription,
                ShortDescriptionh1: productDetails.shortDescriptionh1.toString('html'),
                MainCategory: selectedCategory.name,
                SubCategory: selectedSubcategory,
                productImage: updatedImageUrls,
                brand: productDetails.brand,
                model: productDetails.model,
                weighrange: productDetails.weighRange,
                minweighcapacity: productDetails.minWeighCapacity,
                maxweighcapacity: productDetails.maxWeighCapacity,
                powersupply: productDetails.powerSupply,
                batteryestiamtedusetime: productDetails.batteryEstimatedUseTime,
                powerconsumption: productDetails.powerConsumption,
                lcdbacklight: productDetails.lcdBacklight,
                dimensions: productDetails.dimensions,
            }).then(() => {
                alert('Update Successful');
                // Reset states
                setProductId(null);
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setExistingImages([]);
                setNewImages([]);
                setProductDetails({
                    productName: "",
                    shortDescription: "",
                    shortDescriptionh1Text: "",
                    model: "",
                    weighRange: "",
                    minWeighCapacity: "",
                    maxWeighCapacity: "",
                    powerSupply: "",
                    batteryEstimatedUseTime: "",
                    powerConsumption: "",
                    lcdBacklight: "",
                    dimensions: "",
                    brand: "",
                });
            }).catch(error => {
                console.error("Error updating document: ", error);
                alert("There was an error updating the product. Please try again.");
            });
        };

        const serialNumber = Math.floor(100000 + Math.random() * 9000).toString();

        if (newImages.length > 0) {
            const uploadPromises = newImages.map((image, index) => {
                const imageSerial = `${serialNumber}_${index}`;
                const uploadTask = storage.ref("ProductImage").child(imageSerial).put(image);
                return new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            console.log(progress);
                        },
                        (err) => {
                            console.log(err);
                            reject(err);
                        },
                        () => {
                            storage.ref("ProductImage").child(imageSerial).getDownloadURL().then((imageUrl) => {
                                resolve(imageUrl);
                            });
                        }
                    );
                });
            });

            Promise.all(uploadPromises)
                .then((newImageUrls) => {
                    updateProduct(newImageUrls);
                })
                .catch((err) => {
                    console.error("Error uploading images: ", err);
                    alert("There was an error uploading images. Please try again.");
                });
        } else {
            updateProduct([]);
        }
    };

    return (
        <div className='container'>
            <h1>Edit Product</h1>
            <input
                className='input'
                placeholder='Search by Product Name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className='searchButton'>Search</button>

            {productId && (
                <form className='forms' onSubmit={handleSubmit}>
                    <input className='input' name="productName" placeholder='Product Name' value={productDetails.productName} onChange={handleInputChange} />
                    <input className='input' type='file' placeholder='image' multiple onChange={handleImageChange} />
                    <textarea className='input' name="shortDescription" placeholder='Product Short Description' value={productDetails.shortDescription} onChange={handleInputChange} />
                    <RichTextEditor
                        value={productDetails.shortDescriptionh1}
                        onChange={handleRichTextChange}
                    />

                    <select className='input' value={selectedCategory?.id || ''} onChange={handleCategoryChange}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {selectedCategory && selectedCategory.subcategories.length > 0 && (
                        <select className='input' value={selectedSubcategory || ''} onChange={handleSubcategoryChange}>
                            <option value="">Select Subcategory</option>
                            {selectedCategory.subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    )}
                    <input className='input' name="brand" placeholder='Product Brand' value={productDetails.brand} onChange={handleInputChange} />
                    <input className='input' name="model" placeholder='Product model' value={productDetails.model} onChange={handleInputChange} />
                    <input className='input' name="weighRange" placeholder='Weighing Range' value={productDetails.weighRange} onChange={handleInputChange} />
                    <input className='input' name="minWeighCapacity" placeholder='Minimum Weighing Capacity' value={productDetails.minWeighCapacity} onChange={handleInputChange} />
                    <input className='input' name="maxWeighCapacity" placeholder='Maximum Weighing Capacity' value={productDetails.maxWeighCapacity} onChange={handleInputChange} />
                    <input className='input' name="powerSupply" placeholder='Power Supply' value={productDetails.powerSupply} onChange={handleInputChange} />
                    <input className='input' name="batteryEstimatedUseTime" placeholder='Battery Estimated Use Time' value={productDetails.batteryEstimatedUseTime} onChange={handleInputChange} />
                    <input className='input' name="powerConsumption" placeholder='Power Consumption' value={productDetails.powerConsumption} onChange={handleInputChange} />
                    <input className='input' name="lcdBacklight" placeholder='LCD Backlight' value={productDetails.lcdBacklight} onChange={handleInputChange} />
                    <input className='input' name="dimensions" placeholder='Dimensions' value={productDetails.dimensions} onChange={handleInputChange} />
                    <button type='submit' className='submitButton'>Edit Product</button>
                </form>
            )}
        </div>
    );
}
