module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customerID: String,
      linebot_destination: String,
      linebot_token: String,
      channel_secret: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const customer = mongoose.model("customerData", schema);
  return customer;
};
