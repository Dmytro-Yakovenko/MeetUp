// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const groupsRouter = require('./groups.js');
const eventsRouter = require('./events.js')
const venuesRouter = require('./venues.js')
const groupimagesRouter = require('./group-images.js')
const eventimagesRouter = require('./event-images.js')
const authRouter = require('./auth.js')

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/events', eventsRouter);
router.use('/venues', venuesRouter);
router.use('/auth', authRouter);
router.use('/group-images', groupimagesRouter);
router.use('/event-images', eventimagesRouter);
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});



module.exports = router;