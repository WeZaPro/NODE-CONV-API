module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customerID: String,
      convUserId: String,
      userAgent: String,
      ipAddess: String,
      clientID: String,
      utm_source: String,
      utm_medium: String,
      utm_campaign: String,
      utm_term: String,
      gg_ketword: String,

      lineUid: {
        type: String,
        default: "",
      },
      addFriend: {
        type: String,
        default: "",
      },
      eventA: {
        type: String,
        default: "",
      },
      eventB: {
        type: String,
        default: "",
      },
      eventC: {
        type: String,
        default: "",
      },
      eventD: {
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

  const userGTM = mongoose.model("userGTM", schema);
  return userGTM;
};
