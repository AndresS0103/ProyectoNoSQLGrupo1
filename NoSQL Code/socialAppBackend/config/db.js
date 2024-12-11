import mongoose from "mongoose";

export default function connectDB() {
  const url = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";

  try {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Base de datos en la nube conectada: ${url}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`Error al conectar a la base de datos: ${err}`);
  });
  return;
}
