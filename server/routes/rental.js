const express = require('express');
const {
  create,
  getRentals,
  getRental,
  deleteRental,
} = require('../controllers/rental');
const { authorized } = require('../middleware/auth');
const { checkObjectId } = require('../middleware');

const router = express.Router();

router.delete(
  '/:rentalId',
  [authorized, checkObjectId('rentalId')],
  deleteRental
);
router.get('/:rentalId', getRental);
router.post('/', authorized, create);
router.get('/', getRentals);

module.exports = router;
