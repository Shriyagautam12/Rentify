const router = require("express").Router()

const Booking = require("../models/Booking")



/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})


/* UPDATE BOOKING */

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, totalPrice } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { startDate, endDate, totalPrice }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Fail to update the Booking!", error: err.message });
  }
});
module.exports = router