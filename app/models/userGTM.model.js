module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customerID: String,
      convUserId: String,
      userAgent: String,
      ipAddess: String,
      clientID: String,

      utm_source: {
        type: String,
        default: "",
      },
      utm_medium: {
        type: String,
        default: "",
      },
      utm_campaign: {
        type: String,
        default: "",
      },
      utm_term: {
        type: String,
        default: "",
      },
      gg_ketword: {
        type: String,
        default: "",
      },

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
