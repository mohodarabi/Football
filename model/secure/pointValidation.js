const Yup = require("yup");

exports.pointValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("عنوان تیم الزامی می باشد")
    .min(4, "عنوان تیم نباید کمتر از 4 کاراکتر باشد")
    .max(255, "عنوان تیم نباید بیشتر از 255 کاراکتر باشد"),
  count: Yup.string().required("میزان امتیاز الزامی می باشد"),
});
