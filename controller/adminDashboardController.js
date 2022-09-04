const multer = require('multer')
const moment = require('jalali-moment')

const Team = require('../model/Team')
const Match = require('../model/Match')
const { convertToEn } = require('../utils/jalali')
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
    const matches = await Match.find({ isFinished: false })
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.render('adminDashboard', {
      pageTitle: 'مدیریت حساب کاربری',
      path: '/adminDashboard',
      teams,
      matches,
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

exports.addMatchHandler = async (req, res) => {
  try {
    const { startForecast, endForecast, firstTeam, secondTeam } = req.body

    req.body.startForecast = convertToEn(startForecast)
    req.body.endForecast = convertToEn(endForecast)

    await Match.validation(req.body)

    if (firstTeam === secondTeam) {
      req.flash('error', ['تیم ها باید متفاوت باشند'])
      return res.redirect('/dashboard/admin')
    }

    if (req.body.startForecast === req.body.endForecast) {
      req.flash('error', ['زمان شروع و پایان باید متفاوت باشند'])
      return res.redirect('/dashboard/admin')
    }

    m = moment(req.body.startForecast, 'YYYY-M-D HH:mm:ss')
    if (m.isBefore(moment(req.body.endForecast, 'YYYY-M-D HH:mm:ss')) === false) {
      req.flash('error', ['زمان شروع باید قبل از زمان پایان باشد'])
      return res.redirect('/dashboard/admin')
    }

    await Match.create(req.body)
    req.flash('success_msg', ['مسابقه با موفقیت ایجاد شد'])
    return res.redirect('/dashboard/admin')
  } catch (err) {
    console.log(err)
    req.flash('error', err.errors)
    res.redirect('/dashboard/admin')
  }
}

exports.updateMatchHandler = async (req, res) => {
  try {
    const id = req.params.id

    if (Object.values(req.body)[0] === '' || Object.values(req.body)[1] === '') {
      req.flash('error', ['زمان شروع و پایان باید متفاوت باشند'])
      return res.redirect('/dashboard/admin')
    }

    const match = await Match.findById({ _id: id })

    if (!match) {
      req.flash('error', ['تیم ها باید متفاوت باشند'])
      return res.redirect('/dashboard/admin')
    }

    if (Object.keys(req.body)[0] !== match.firstTeam || Object.keys(req.body)[1] !== match.secondTeam) {
      req.flash('error', ['زمان شروع و پایان باید متفاوت باشند'])
      return res.redirect('/dashboard/admin')
    }

    match.result = {
      firstTeam: Object.values(req.body)[0],
      secondTeam: Object.values(req.body)[1],
    }
    match.isFinished = true
    match.save()
    req.flash('success_msg', ['مسابقه با موفقیت ایجاد شد'])
    return res.redirect('/dashboard/admin')
  } catch (err) {
    console.log(err)
    req.flash('error', err.errors)
    res.redirect('/dashboard/admin')
  }
}
