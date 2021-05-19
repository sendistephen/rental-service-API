const express = require('express');
const {
  create,
  getRentals,
  getRental,
  deleteRental,
  update,
  getUserRentals,
} = require('../controllers/rental');
const { authorized } = require('../middleware/auth');
const { checkObjectId } = require('../middleware');

const router = express.Router();

router.get('/me', authorized, getUserRentals);
router.get('/', getRentals);
router.delete(
  '/:rentalId',
  [authorized, checkObjectId('rentalId')],
  deleteRental
);
router.patch('/:rentalId', [authorized, checkObjectId('rentalId')], update);
router.get('/:rentalId', checkObjectId('rentalId'), getRental);
router.post('/', authorized, create);

module.exports = router;
