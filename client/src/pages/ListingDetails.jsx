import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";


const ListingDetails = () => {
  const [loading, setLoading] = useState(true);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  console.log(listing);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <div className=" pt-10 md:px-32 pb-28 xl:px-[80px] lg:px-[50px] px-5">
        <div className=" md:flex-row  gap-4 md:gap-0 md:items-center flex flex-col items-start ">
          <h1 className="text-2xl md:text-[32px]">{listing.title}</h1>
          <div></div>
        </div>

        <div className="flex flex-wrap gap-3 my-5 mx-0">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="listing photo"
              className=" max-w-[280px]"
            />
          ))}
        </div>

        <h2 className="text-3xl font-semibold">
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p className=" my-5">
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr className=" text-black my-5" />

        <div className="flex gap-5 items-center">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
            className=" w-[60px] h-[60px] m-0"
          />
          <h3 className=" text-2xl font-semibold">
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr className=" my-5" />

        <h3 className=" text-2xl font-semibold">Description</h3>
        <p className=" max-w-[800px] mt-5">{listing.description}</p>
        <hr className=" my-5" />

        <h3 className=" text-2xl font-semibold">{listing.highlight}</h3>
        <p className=" max-w-[800px] mt-5">{listing.highlightDesc}</p>
        <hr className=" my-5" />

        <div className=" flex justify-between md:flex-row flex-col lg:gap-[50px]">
          <div>
            <h2 className=" text-2xl font-semibold">What this place offers?</h2>
            <div className="grid grid-cols-1 gap-5  my-7 max-w-[700px]">
              {listing.amenities[0].split(",").map((item, index) => (
                <div
                  className="flex items-center gap-5 text-lg font-semibold mb-5"
                  key={index}
                >
                  <div className=" text-[30px]">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?. icon
                    }
                  </div>
                  <p className="m-0">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className=" my-[30px]">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2 className="mb-[10px] text-2xl font-semibold">
                  ₹ {listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2 className="mb-[10px] text-2xl font-semibold">
                  ₹ {listing.price} x {dayCount} night
                </h2>
              )}

              <h2 className=" text-xl font-medium">Total price: ${listing.price * dayCount}</h2>
              <p className=" text-lg font-normal">Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p className=" text-lg font-normal">End Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                type="submit"
                onClick={handleSubmit}
                className=" bg-[#F8395A] py-2 px-4 text-white rounded-lg cursor-pointer transition-all ease-in delay-100 w-full mt-[30px] lg:max-w-[300px]"
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ListingDetails;
