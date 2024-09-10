module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customerID: String,
      linebot_destination: String,
      linebot_token: String,
      channel_secret: String,
      Measurement_id: String,
      addFriend_name: {
        type: String,
        default: "",
      },
      addFriend_secret: {
        type: String,
        default: "",
      },
      eventA_name: {
        type: String,
        default: "",
      },
      eventA_secret: {
        type: String,
        default: "",
      },
      eventB_name: {
        type: String,
        default: "",
      },
      eventB_secret: {
        type: String,
        default: "",
      },
      eventC_name: {
        type: String,
        default: "",
      },
      eventC_secret: {
        type: String,
        default: "",
      },
      eventD_name: {
        type: String,
        default: "",
      },
      eventD_secret: {
        type: String,
        default: "",
      },
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
