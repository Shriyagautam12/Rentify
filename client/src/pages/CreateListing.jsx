import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { categories, types, facilities } from "../data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };
  /* BASIC COUNTS */
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  /* AMENITIES */
  const [amenities, setAmenities] = useState([]);

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  /* UPLOAD, DRAG & DROP, REMOVE PHOTOS */
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  /* DESCRIPTION */
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const creatorId = useSelector((state) => state.user._id);

  const navigate = useNavigate();
  

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      /* Create a new FormData onject to handle file uploads */
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
      listingForm.append("city", formLocation.city);
      listingForm.append("province", formLocation.province);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("amenities", amenities);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlight", formDescription.highlight);
      listingForm.append("highlightDesc", formDescription.highlightDesc);
      listingForm.append("price", formDescription.price);

      /* Append each selected photos to the FormData object */
      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      /* Send a POST request to server */
      const response = await fetch("http://localhost:3001/properties/create", {
        method: "POST",
        body: listingForm,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-[#F7F8F8] lg:pt-10 lg:px-[60px] lg:pb-[120px] py-10 px-5 ">
        <h1 className=" text-[#24355A]">Post your Ad here</h1>
        <form onSubmit={handlePost}>
          <div className="bg-white py-8 md:px-10 px-5">
            <h2 className="text-[#F8395A]">Step 1: Describe Your Place</h2>
            <hr className=" mt-4 mx-0 mb-6" />

            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl"> Which of the following categories describes your place?</div>
            <div className="flex items-center justify-center flex-wrap gap-5 lg:px-5 md:p-0 ">
              {categories?.map((item, index) => (
                <div
                  className={`flex flex-col justify-center items-center w-[110px] h-[90px]
                  border-e-gray-800 border-[1px] rounded-[10px] cursor-pointer 
                  transition-all duration-200 ease-in-out hover:border-[1px] hover:border-[#F8395A] hover:bg-[#F7F8F8]
                  ${
                    category === item.label
                      ? "border-[#F8395A] border-[2px] bg-[#F7F8F8]"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className=" text-3xl text-black">
                    {" "}
                    {React.createElement(item.icon)}
                  </div>
                  <p className=" font-semibold text-center text-black">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">What type of place will guests have?</div>
            <div className="flex flex-col gap-5">
              {types?.map((item, index) => (
                <div
                  className={`flex justify-between items-center max-w-[600px] py-4 px-7 
                  border-e-gray-800 border-[1px] rounded-[10px] cursor-pointer 
                  transition-all duration-300 ease-in-out hover:border-[2px]
                   hover:border-[#F8395A] hover:bg-[#F7F8F8]
                   ${
                     type === item.name
                       ? "border-[#F8395A] border-[2px] bg-[#F7F8F8] "
                       : ""
                   }`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="max-w-[400px]">
                    <h4 className=" mb-1 font-medium text-lg">{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className=" text-3xl">
                    {" "}
                    {React.createElement(item.icon)}
                  </div>
                </div>
              ))}
            </div>

            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">Where's your place located?</div>
            <div className=" max-w-[700px]">
              <div>
                <p className=" font-bold mt-5 mb-2">Street Address</p>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  className=" border-e-gray-800 border-[1px] rounded-[10px] py-4 px-7 focus:outline-none"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="max-w-[700px] lg:grid lg:grid-cols-1 lg:gap-10 flex flex-col gap-0">
              <div>
                <p className=" font-bold mt-5 mb-2">
                  Apartment, Suite, etc. (if applicable)
                </p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                  required
                  className=" border-e-gray-800 border-[1px] rounded-[10px] py-4 px-7 focus:outline-none"
                />
              </div>
              <div>
                <p className=" font-bold mt-5 mb-2">City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                  className=" border-e-gray-800 border-[1px] rounded-[10px] py-4 px-7 focus:outline-none"
                />
              </div>
            </div>

            <div className="max-w-[700px] lg:grid lg:grid-cols-1 lg:gap-10 flex flex-col gap-0">
              <div>
                <p className=" font-bold mt-5 mb-2">Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                  className=" border-e-gray-800 border-[1px] rounded-[10px] py-4 px-7 focus:outline-none"
                />
              </div>
              <div>
                <p className=" font-bold mt-5 mb-2">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                  className=" border-e-gray-800 border-[1px] rounded-[10px] py-4 px-7 focus:outline-none"
                />
              </div>
            </div>
            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">Share some basics about your place</div>
            <div className=" flex flex-wrap gap-10">
              <div className=" flex items-center gap-7 p-4 border-e-gray-800 border-[1px] rounded-[10px]">
                <p className=" font-semibold">Guests</p>
                <div className=" flex items-center gap-2 text-xl">
                  <RemoveCircleOutline
                    onClick={() => {
                      guestCount > 1 && setGuestCount(guestCount - 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setGuestCount(guestCount + 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-7 p-4 border-e-gray-800 border-[1px] rounded-[10px]">
                <p className=" font-semibold">Bedrooms</p>
                <div className="flex items-center gap-2 text-xl">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedroomCount(bedroomCount + 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-7 p-4 border-e-gray-800 border-[1px] rounded-[10px]">
                <p className=" font-semibold">Beds</p>
                <div className="flex items-center gap-2 text-xl">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedCount > 1 && setBedCount(bedCount - 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedCount(bedCount + 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-7 p-4 border-e-gray-800 border-[1px] rounded-[10px]">
                <p className=" font-semibold">Bathrooms</p>
                <div className="flex items-center gap-2 text-xl">
                  <RemoveCircleOutline
                    onClick={() => {
                      bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBathroomCount(bathroomCount + 1);
                    }}
                    className=" text-2xl cursor-pointer hover:text-[#F8395A]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white py-7 md:px-10 rounded-[20px] mt-10 sm:px-5">
            <h2 className="text-[#F8395A]">
              Step 2: Make your place stand out
            </h2>
            <hr className=" mt-4 mb-6" />
            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">
              Tell guests what your place has to offer
            </div>
            <div className="flex flex-wrap gap-5">
              {facilities?.map((item, index) => (
                <div
                  className={` flex flex-col justify-center items-center w-[200px] 
                  h-[90px] border-e-gray-800 border-[1px] rounded-[10px] cursor-pointer 
                  transition-all duration-200 ease-in-out hover:border-[2px] hover:border-[#F8395A]  ${
                    amenities.includes(item.name)
                      ? "hover:border-[2px] hover:border-[#F8395A] bg-[#F7F8F8] border-[#F8395A] border-[2px] " 
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className=" text-3xl">
                    {React.createElement(item.icon)}
                  </div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">Add some photos of your place</div>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable
                droppableId="photos"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    className="flex flex-wrap gap-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="image"
                          className=" py-10 lg:px-[100px] md:px-[80px] px-[30px] rounded-[10px] flex 
                        flex-col items-center gap-3 bg-[#F7F8F8] justify-center cursor-pointer border-dashed border-gray-300 border-[1px]"
                        >
                          <div className=" text-[60px]">
                            <IoIosImages />
                          </div>
                          <p className=" text-center font-semibold">
                            Upload from your device
                          </p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="relative w-[250px] h-[150px] cursor-move"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="place"
                                    className="w-full h-full"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-0 right-0 p-1 bg-[#F7F8F8] cursor-pointer text-xl hover:text-[#F8395A]"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="image"
                          className="w-[250px] h-[150px]  py-10 lg:px-[100px] md:px-[80px] px-[30px] rounded-[10px] flex 
                        flex-col items-center gap-3 bg-[#F7F8F8] justify-center cursor-pointer border-dashed border-gray-300 border-[1px]"
                        >
                          <div className=" text-[60px]">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className=" mt-10 mb-5 text-[#24355A] font-semibold text-3xl">What make your place attractive and exciting?</div>
            <div >
              <p className=" font-bold mt-5 mb-2">Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
                className=" border-e-gray-800 border-[1px] rounded-[10px]
                 py-4 px-7 text-base font-semibold lg:w-[600px] md:w-[350px] w-[280px]"
              />
              <p className=" font-bold mt-5 mb-2">Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
                className=" border-e-gray-800 border-[1px] rounded-[10px]
                 py-4 px-7 text-base font-semibold lg:w-[600px] md:w-[350px] w-[280px]"
              />
              <p className=" font-bold mt-5 mb-2">Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
                className=" border-e-gray-800 border-[1px] rounded-[10px]
                 py-4 px-7 text-base font-semibold lg:w-[600px] md:w-[350px] w-[280px]"
              />
              <p className=" font-bold mt-5 mb-2">Highlight details</p>
              <textarea
                type="text"
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
                className=" border-e-gray-800 border-[1px] rounded-[10px]
                 py-4 px-7 text-base font-semibold lg:w-[600px] md:w-[350px] w-[280px]"
              />
              <p className=" font-bold mt-5 mb-2">Now, set your PRICE</p>
              <span className=" font-bold mr-5 text-2xl">₹</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                className=" border-e-gray-800 border-[1px] rounded-[10px]
                py-4 px-7 text-base font-semibold lg:w-[600px] md:w-[350px] w-[280px]"
                required
              />
            </div>
          </div>

          <button
            className=" mt-10 py-2 px-4 bg-[#F8395A] border-none 
          text-xl font-semibold cursor-pointer transition-all duration-300 ease-in-out text-white rounded-[10px]"
            type="submit"
          >
            CREATE YOUR LISTING
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
