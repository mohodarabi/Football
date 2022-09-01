exports.userAuthenticate = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'user') {
    return next()
  }
  res.redirect('/404')
}

exports.adminAuthenticate = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next()
  }
  res.redirect('/404')
}
