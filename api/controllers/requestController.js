const mongoose = require("mongoose");
const requestModel = require("../models/requestModel");

const shortUrl = (req, res) => {
  const originalUrl = req.body.url;
  console.log(originalUrl);
  const request = new requestModel({
    _id: new mongoose.Types.ObjectId(),
    originalUrl: originalUrl,
  });
  request.save().then((result) => {
    console.log(result);
  });

  res.status(200).json({ message: "Hello " + originalUrl });
};

const originalUrl = (req, res) => {
  console.log(req.params);
  const url = req.params.url;
  //search in mongo db and redirect to original url
  requestModel
    .find({ shortUrl: url })
    .exec()
    .then((data) => {
      var jsonData = data;
      if (jsonData.length == 0) {
        res.status(404).json({ success: "false", message: "Not Found!!!" });
      } else {
        console.log(data[0]);
        requestModel.findOneAndUpdate(
          { _id: data[0]._id },
          {
            $set: {
              clicks: data[0].clicks + 1,
            },
          },
          { useFindAndModify: false },
          (err, doc) => {
            console.log("document here" + doc);
            if (doc == null) {
              res.status(400).json({
                success: false,
                message: "cannot find url",
              });
            }
            if (err) {
              console.log(err);
              res.status(500).json(err);
            } else {
              res.status(200).json({ success: "true", doc });
            }
          }
        );
      }
    });
};

module.exports.shortUrl = shortUrl;
module.exports.originalUrl = originalUrl;
