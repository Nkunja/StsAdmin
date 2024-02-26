
import React, { useState } from 'react'
import "./AddProducts.css"
import { db, storage } from '../../../Database/config';


export default function AddProduct() {
    const [productname, setProductName] = useState("");
    const [productimage, setProductImage] = useState([]);
    const [shortdescription, setShortDescription ] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [model, setmodel] = useState("");
    const [weighrange, setweighrange] = useState("");
    const [minweighcapacity, setminweighcapacity] = useState("");
    const [maxweighcapacity, setmaxweighcapacity] = useState("");
    const [powersupply, setpowersupply] = useState("")
    const [batteryestiamtedusetime, setbatteryestiamtedusetime] = useState("")
    const [powerconsumption, setpowerconsumption] = useState("");
    const [lcdbacklight, setlcdbacklight] = useState("");
    const [dimensions, setdimensions] = useState("");
    const [brand, setbrand] = useState("");

    const categories = [
        { id: 1, name: 'WeighBridge', subcategories: ['Axle', 'Concrete', 'Steel'] },
        { id: 2, name: 'Retail Scale', subcategories: ['Price Computing', 'Cash Register', 'Label Printing'] },
        { id: 3, name: 'Industrial Scale', subcategories: ['Platform Scales', 'Floor Scales', 'Hanging Scales', 'Weighing Tanks', 'Pallet truck & scales', 'Animal Scales', 'Monorail Scales', 'Analytical Scales'] },
        { id: 4, name: 'Medical Scales', subcategories: [] },
        { id: 5, name: 'Spares & Accessories', subcategories: ['Load Cells', 'Indicators', 'Cables', 'Leveling Test', 'Batteries', 'Chargers'] },
        { id: 6, name: 'Softwares', subcategories: ['Retail Softwares', 'Weighbridge Softwares'] },
        { id: 7, name: 'POS Hardware', subcategories: ['Terminals', 'Printers', 'Scanners', 'Cash drawers', 'Thermal rolls', 'Thermal labels'] },
        { id: 8, name: 'Counter Scales', subcategories:[]},
      ];
      const handleCategoryChange = (event) => {
        const selectedCategoryId = parseInt(event.target.value);
        const selectedCategory = categories.find(category => category.id === selectedCategoryId);
        setSelectedCategory(selectedCategory);
        setSelectedSubcategory(null);
      };
    
      const handleSubcategoryChange = (event) => {
        const selectedSubcategory = event.target.value;
        setSelectedSubcategory(selectedSubcategory);
      };

    const handleImageChange = (e) => {
        e.preventDefault();

        let pickedfile;
        if(e.target.files && e.target.files.length>0){
            pickedfile=e.target.files[0];
            setProductImage(pickedfile);
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if (!productimage ||!model || !productname || !shortdescription 
            || !model || !selectedCategory  || !weighrange || 
            !minweighcapacity || !maxweighcapacity || !powersupply || !batteryestiamtedusetime 
            || !powerconsumption || !lcdbacklight || !dimensions || !brand)
        {
            alert("Please fill all the fields");
            return;
        }

        const serialNumber =Math.floor(100000+Math.random()*9000).toString();

        const uploadTask = storage.ref("ProductImage")
        .child(serialNumber)
        .put(productimage);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                let progress=((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                console.log(progress)
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
                storage.ref("ProductImage")
                .child(serialNumber)
                .getDownloadURL()
                .then((imageUrl)=>{
                    db.collection("Products").add({
                        ProductName: productname,
                        ShortDescription: shortdescription,
                        MainCategory:selectedCategory,
                        productImage: imageUrl,
                        SubCategory: selectedSubcategory,
                        brand: brand,
                        model: model,
                        weighrange: weighrange,
                        minweighcapacity: minweighcapacity,
                        maxweighcapacity: maxweighcapacity,
                        powersupply: powersupply,
                        batteryestiamtedusetime: batteryestiamtedusetime,
                        powerconsumption: powerconsumption,
                        lcdbacklight: lcdbacklight,
                        dimensions: dimensions,
                    })

                    alert('Upload Successful');

                    //reset
                    setSelectedCategory("");
                    setProductImage(null);
                    setSelectedSubcategory("");
                    setProductName("");
                    setbatteryestiamtedusetime("");
                    setbrand("");
                    setdimensions("");
                    setlcdbacklight("");
                    setmaxweighcapacity("")
                    setminweighcapacity("")
                    setmodel("")
                    setpowerconsumption("");
                    setpowersupply("");
                    setweighrange("");
                })
            }
        )
    }

  return (
    <div className='container'>
        <h1>Add Product</h1>
        <form className='forms'>
        <input className='input' placeholder='Product Name' value={productname}  onChange={(e)=> setProductName(e.target.value)}/>
        <input className='input' type='file' placeholder='image'  onChange={handleImageChange}/>
        <textarea className='input' placeholder='Product Short Description' value={shortdescription}  onChange={(e)=> setShortDescription(e.target.value)}/>
        <textarea className='input' placeholder='Product Model' value={model}  onChange={(e)=> setmodel(e.target.value)}/>
        <textarea className='input' placeholder='Product Weigh Range' value={weighrange}  onChange={(e)=> setweighrange(e.target.value)}/>
        <textarea className='input' placeholder='Product Weigh Capacity(Min)' value={minweighcapacity}  onChange={(e)=> setminweighcapacity(e.target.value)}/>
        <textarea className='input' placeholder='Product Weigh Capacity(Max)' value={maxweighcapacity}  onChange={(e)=> setmaxweighcapacity(e.target.value)}/>
        <textarea className='input' placeholder='Product Power Supply' value={powersupply}  onChange={(e)=> setpowersupply(e.target.value)}/>
        <textarea className='input' placeholder='Product Battery Estimated USe Time' value={batteryestiamtedusetime}  onChange={(e)=> setbatteryestiamtedusetime(e.target.value)}/>
        <textarea className='input' placeholder='Product Power Consumption' value={powerconsumption}  onChange={(e)=> setpowerconsumption(e.target.value)}/>
        <textarea className='input' placeholder='Product LCD Backlight' value={lcdbacklight}  onChange={(e)=> setlcdbacklight(e.target.value)}/>
        <textarea className='input' placeholder='Product Dimensions' value={dimensions}  onChange={(e)=> setdimensions(e.target.value)}/>
        <select className='input' value={brand}  onChange={(e)=> setbrand(e.target.value)}>
            <option value="">Select Manufucturer</option>
            <option>Aclas</option>
            <option>Zemic</option>
            <option>T-Scale</option>
            <option>Esit</option>
            <option>Akeli</option>
            <option>Want</option>
            <option>ScalesTech</option>
        </select>
        <select className='input' id="category" onChange={handleCategoryChange} value={selectedCategory ? selectedCategory.id : ''}>
        <option value="">Select Main Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <label htmlFor="subcategory">Select Subcategory:</label>
          <select className='input' id="subcategory" onChange={handleSubcategoryChange} value={selectedSubcategory || ''}>
            <option value="">Select</option>
            {selectedCategory.subcategories.map(subcategory => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      )}

        <button onClick={handleSubmit}  className='submitbutton'>Submit</button>
        </form>
    </div>
  )
}