import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    swagger: "2.0",
    info: {
      title: "Hans Wehr DB API",
      version: "0.1.0",
      description:
        "This is an API used to query the Hans Wehr dictionary database.",
      contact: {
        name: "Manaf Asif",
        url: "https://manaf.info",
        email: "manaf.asif12@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(options);
