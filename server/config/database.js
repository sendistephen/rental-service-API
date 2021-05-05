const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(
    process.env.DB_CONN,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.log(err.message);
      }
      console.log(`Database connection successfull!`);
    }
  );
};
