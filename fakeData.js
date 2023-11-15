const faker = require("faker");

function generateFakeData(template, count) {
  if (!template || typeof template !== "object") {
    throw new Error("Invalid template. Expecting an object.");
  }

  const fakeData = [];

  for (let i = 0; i < count; i++) {
    const entry = {};

    for (const key in template) {
      if (template.hasOwnProperty(key)) {
        const fieldType = template[key];

        if (typeof fieldType === "function") {
          entry[key] = fieldType();
        } else {
          entry[key] = generateFakeField(fieldType);
        }
      }
    }

    fakeData.push(entry);
  }

  return fakeData;
}

function generateFakeField(fieldType) {
  switch (fieldType) {
    case "string":
      return faker.random.word();
    case "number":
      return faker.random.number();
    case "email":
      return faker.internet.email();
    // Add more types as needed
    default:
      throw new Error(`Unsupported field type: ${fieldType}`);
  }
}

module.exports = generateFakeData;
