const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const admin = require('./modules/admin')

const upload = require('../../middleware/multer')

const restController = require('../../controllers/pages/restaurant-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/​​comment-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth') // 把驗證程序 authenticatedAdmin 向上抽離到index.js

const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants/top', restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)// 順序在/:id前以免feeds被誤認為id
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants', restController.getRestaurants)

// comments
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// add on/delete from favorites
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// users
router.get('/users/top', authenticated, userController.getTopUsers)// 美食達人
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', upload.single('image'), authenticated, userController.putUser)

// likes router
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// following&followers
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
