const Yup = require('yup')

exports.teamValidationSchema = Yup.object().shape({
  name: Yup.string().required('نام تیم الزامی می باشد').min(4, 'نام تیم نباید کمتر از 4 کاراکتر باشد').max(255, 'نام تیم نباید بیشتر از 255 کاراکتر باشد'),
  league: Yup.string().required('لیگ تیم الزامی می باشد'),
  logo: Yup.mixed().required('لوگو تیم الزامی می باشد'),
})
