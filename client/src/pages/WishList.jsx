
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
// import Footer from "../components/Footer"

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);

  return (
    <>
      <Navbar />
      <h1 className=" my-10 md:mx-[100px] mx-12 text-3xl text-blue-900 font-semibold ">Your Wish List</h1>
      <div className="pt-0 px-[100px] pb-[120px] flex flex-wrap justify-center gap-6 xl:px-5">
        {wishList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default WishList;
