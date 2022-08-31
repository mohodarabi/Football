const fs = require('fs')

const multer = require('multer')
const shortId = require('shortid')
const sharp = require('sharp')
const appRoot = require('app-root-path')

const { formatDate } = require('../utils/jalali')
const { get500, get404 } = require('./errorController')
const { fileFilter } = require('../utils/multer')

exports.getDashboard = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')

    res.render('userDashboard', {
      pageTitle: 'مدیریت حساب کاربری',
      path: '/dashboard',
      fullname: req.user.fullname,
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}
