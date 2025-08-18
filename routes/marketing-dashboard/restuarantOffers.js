const express = require('express')
const router = express.Router()
const {getAllOffers, getAdminOffers,createOffer, AdminAccept,updateOffer, deleteOffer,suggestion} = require('../../controller/marketing-dashboard/offerController')

router.get('/', getAllOffers)   // to get all the offers
router.post('/', createOffer)   // create a new offer
router.put('/:id', updateOffer) // upodate offer by id
router.put('/delete/:id', deleteOffer) // delete offer by id
router.get("/admin",getAdminOffers)
router.put("/suggestion/:id",suggestion)
router.put("/admin/accept/:id",AdminAccept)
module.exports = router