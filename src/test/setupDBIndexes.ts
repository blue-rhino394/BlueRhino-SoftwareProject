import { databaseWrapper } from "../databaseWrapper";




databaseWrapper.runMongoOperation(async function (database) {

    const cardCollection = await database.collection("cards");

    const result = await cardCollection.createIndex({
        slug: "text",
        firstName: "text",
        lastName: "text"
    });


    console.log(result);
});