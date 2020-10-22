import { databaseWrapper } from "../databaseWrapper";




databaseWrapper.runMongoOperation(async function (database) {

    const cardCollection = await database.collection("cards");

    const result = await cardCollection.createIndex({
        "ownerInfo.firstName": "text",
        "ownerInfo.lastName": "text",
        "ownerInfo.customURL": "text",
    });


    console.log(result);
});