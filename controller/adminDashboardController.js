const fs = require('fs')

const multer = require('multer')

const { get500, get404 } = require('./errorController')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/logo')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.getDashboard = async (req, res) => {
  try {
    console.log('is here')
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')

    res.render('adminDashboard', {
      pageTitle: 'مدیریت حساب کاربری',
      path: '/adminDashboard',
      username: req.user.username,
      role: req.user.role,
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}

exports.addTeamHandler = async (req, res) => {
  console.log(req.file)
  console.log(req.body)
}

exports.uploadImage = upload.single('logo')
