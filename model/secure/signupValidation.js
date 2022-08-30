const Yup = require("yup");

exports.signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("username الزامی می باشد")
    .min(4, "username نباید کمتر از 4 کاراکتر باشد")
    .max(255, "username نباید بیشتر از 255 کاراکتر باشد"),
  email: Yup.string()
    .email("ایمیل معتبر نمی باشد")
    .required("ایمیل الزامی می باشد"),
  password: Yup.string()
    .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
    .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد")
    .required("کلمه عبور الزامی می باشد"),
  repassword: Yup.string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([Yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),
});
