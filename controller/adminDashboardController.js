const multer = require('multer')

const Team = require('../model/Team')
const { get500, get404 } = require('./errorController')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/logo')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `logo-${req.user.id}-${Date.now()}.${ext}`)
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
    const teams = await Team.find({})
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.render('adminDashboard', {
      pageTitle: 'مدیریت حساب کاربری',
      path: '/adminDashboard',
      teams,
      username: req.user.username,
      role: req.user.role,
      message: req.flash('success_msg'),
      error: req.flash('error'),
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}

exports.addTeamHandler = async (req, res) => {
  try {
    await Team.validation({ ...req.body, logo: req.file })
    req.body.logo = `localhost:${process.env.PORT}/uploads/logo/${req.file.filename}`
    const team = await Team.findOne({ name: req.body.name })
    if (team) {
      req.flash('error', ['این تیم قبلا ثبت شده است'])
      return res.redirect('/dashboard/admin')
    }
    await Team.create(req.body)
    req.flash('success_msg', ['تیم با موفقیت ایجاد شد'])
    return res.redirect('/dashboard/admin')
  } catch (err) {
    req.flash('error', err.errors)
    res.redirect('/dashboard/admin')
  }
}

exports.uploadImage = upload.single('logo')
