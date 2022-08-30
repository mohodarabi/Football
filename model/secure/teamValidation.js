const Yup = require("yup");

exports.teamValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام الزامی می باشد")
    .min(4, "نام نباید کمتر از 4 کاراکتر باشد")
    .max(255, "نام نباید بیشتر از 255 کاراکتر باشد"),
  league: Yup.string().required("لیگ الزامی می باشد"),
});
