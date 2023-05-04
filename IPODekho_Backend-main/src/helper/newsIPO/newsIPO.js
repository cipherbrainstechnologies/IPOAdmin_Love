const { firestore } = require("../../config/firestoreCloud");
const express = require("express");
const webApp = express();
const saltedMd5 = require("salted-md5");
const path = require("path");
var admin = require("firebase-admin");
const moment = require("moment");
const News = firestore.collection("News");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("FGYOEUJ8DR", "ad1139d39fa664e5969253e8f33b698f");
const index = client.initIndex("IPONews");
webApp.locals.bucket = admin.storage().bucket();
/**
 * The following Api contains source code for a Create News.
 */
const createNews = async (req, res, body) => {
  try {
    if (req.file) {
      const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      const fileName = name + path.extname(req.file.originalname);
      await webApp.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(req.file.buffer);
      const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
      const myDateString = req.body.Date;
      const myDate = new Date(myDateString);
      // console.log(date);
      const newsIPO = {
        Date: req.body.Date || "",
        Title: req.body.Title || "",
        Content: req.body.Content || "",
        url: req.body.url || "",
        createdAt: new Date(),
        file: file,
      };
      if (newsIPO) {
        const algoliaResponse = await index.saveObject(newsIPO, {
          autoGenerateObjectIDIfNotExist: true,
        });
        console.log(algoliaResponse, "algoliaResponse");
        const record = {
          ...newsIPO,
          algoliaID: algoliaResponse.objectID,
        };
        await News.add(record);
        const algoliaID = { algoliaID: algoliaResponse.objectID };
        const Data = Object.assign(record, algoliaID);
        console.log(Data, "aaaaa");
        res.status(200).send({
          msg: "News Created Successfully",
          data: Data,
        });
      } else {
        res.status(300).send({ msg: "News Not Created" });
      }
    } else {
      const myDateString = req.body.Date;
      const myDate = new Date(myDateString);
      const Data = {
        Date: req.body.Date || "",
        Title: req.body.Title || "",
        Content: req.body.Content || "",
        url: req.body.url || "",
        createdAt: new Date(),
      };
      if (Data) {
        const algoliaResponse = await index.saveObject(Data, {
          autoGenerateObjectIDIfNotExist: true,
        });
        console.log(algoliaResponse, "algoliaResponse");
        const record = {
          ...Data,
          algoliaID: algoliaResponse.objectID,
        };
        await News.add(record);
        const algoliaID = { algoliaID: algoliaResponse.objectID };
        const data = Object.assign(record, algoliaID);
        console.log(data, "aaaaa");
        res.status(200).send({
          msg: "News Created Successfully",
          data: data,
        });
      } else {
        res.status(300).send({ msg: "News Not Found" });
      }
    }
  } catch (error) {
    console.log(error, "error");
    res.status(400).send(error);
  }
};
/**
 * The following Api contains source code for a Update News.
 */
const UpdateNews = async (req, res) => {
  const id = req.params.id;
  const objectID = req.body.algoliaID;
  delete req.params.id;
  const GetNews = News.doc(id);
  const GetData = await GetNews.get();
  const myDateString = req.body.Date;
  const myDate = new Date(myDateString);
  const Data = {
    Date: req.body.Date || "",
    Title: req.body.Title || "",
    Content: req.body.Content || "",
    url: req.body.url || "",
    createdAt: new Date(),
  };
  if (Data) {
    Data.objectID = objectID;
    index
      .saveObject(Data, { autoGenerateObjectIDIfNotExist: true })
      .then(() => {
        console.log(`Record with ID ${objectID} was updated in Algolia`);
      })
      .catch((error) => {
        console.error(`Error updating record with ID ${id}:`, error);
      });
    await News.doc(id).update(Data, { new: true });
    res
      .status(200)
      .send({ msg: "News updated Successfully", data: { ...Data } });
  } else {
    res.status(300).send({ msg: "UserId Not Found" });
  }
};
/**
 * The following Api contains source code for a Upload News Image.
 */
const updateNewsImage = async (req, res) => {
  try {
    if (req.file) {
      const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      const fileName = name + path.extname(req.file.originalname);
      await webApp.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(req.file.buffer);
      const id = req.params.id;
      const objectID = req.body.algoliaID;
      const GetNews = News.doc(id);
      const GetData = await GetNews.get();
      const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
      const updateFile = {
        file: file,
        id: id,
        algoliaID: objectID,
      };
      const get = GetData.data();
      const recordd = {
        Date: get.Date,
        Title: get.Title,
        Content: get.Content,
        url: get.url,
        file: updateFile.file,
      };
      if (GetData) {
        recordd.objectID = objectID;
        index
          .saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            console.log(`Record with ID ${objectID} was updated in Algolia`);
          })
          .catch((error) => {
            console.error(`Error updating record with ID ${id}:`, error);
          });
        await News.doc(id).update({ file: file });
        res
          .status(200)
          .send({ msg: "News-Image Updated Successfully", file: updateFile });
      }
    } else if (req.file == null) {
      const id = req.params.id;
      delete req.params.id;
      const GetNews = News.doc(id);
      const GetData = await GetNews.get();
      const updateFile = {
        file: "",
        id: id,
      };
      if (GetData.exists) {
        await News.doc(id).update(updateFile, { new: true });
        res
          .status(200)
          .send({ msg: "Image Updated Successfully", status: updateFile });
      } else {
        res.status(300).send({ msg: "Image Not Found" });
      }
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Get All News.
 */
const GetAllNews = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    let page = req.query.page || 1;
    const search = req.body.search;
    if (req.body.search) {
      const GetNews = await News.select(
        "Date",
        "Title",
        "Content",
        "file",
        "createdAt",
        "algoliaID"
      );
      GetNews.offset(Number(page - 1) * limit)
        .limit(Number(limit))
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            res.status(200).send({ msg: "No more documents left" });
            return;
          }
          const News = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          GetNews.get().then((querySnapshot) => {
            let Total = querySnapshot.size;
            // const Merged = { MainLineIpo, Total };

            // index.setSettings({
            //   searchableAttributes: [
            //     "companyName",
            //     "IPOOpenDate",
            //     "IPOCloseDate",
            //     "lotSize",
            //     "GMPStatus",
            //     "IPOStatus",
            //     "fromPrice",
            //     "toPrice",
            //     "disclaimer",
            //     // add all other attributes you want to search across here
            //   ],
            //   attributesForFaceting: [
            //     "numeric(fromPrice)",
            //     "numeric(toPrice)",
            //     "numeric(lotSize)",
            //     // add all other numerical attributes here
            //   ],
            // });
            // index.saveObjects(Merged, { autoGe }).wait();
            // index
            //   .saveObjects(MainLineIpo, {
            //     autoGenerateObjectIDIfNotExist: true,
            //   })
            //   .then(({ objectIDs }) => {
            //     console.log(`Indexed ${objectIDs.length} objects to Algolia`);
            //   })
            //   .catch((err) => {
            //     console.error(`Error indexing to Algolia: ${err}`);
            //   });
            index
              .search(search, { hitsPerPage: 10, attributesToHighlight: [] })
              .then(({ hits }) => {
                // const hits = MainLineIpo;
                const AllNews = { AllNews: hits };
                res
                  .status(200)
                  .send({ msg: "All News Get Successfully", data: AllNews });
              });
            // const objectID = req.body.objectID;

            // index.deleteObject(objectID, (err) => {
            //   if (err) throw err;
            //   console.log("Object removed successfully");
            // });
            // res.status(200).send({ msg: "All IPOS", data: Merged });
          });
        });
    } else {
      const GetNews = await News.select(
        "Date",
        "Title",
        "Content",
        "file",
        "createdAt",
        "algoliaID"
      );
      if (GetNews) {
        GetNews.offset(Number(page - 1) * limit)
          .limit(Number(limit))
          .orderBy("createdAt", "desc")
          .get()
          .then((querySnapshot) => {
            console.log(`Page ${page}:`);
            const AllNews = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            News.get().then((querySnapshot) => {
              let Total = querySnapshot.size;
              const Merged = { AllNews, Total };
              res
                .status(200)
                .send({ msg: "All News Get Successfully", data: Merged });
            });
          });
      } else {
        res.status(200).send({ msg: "Not Get All News", data: Merged });
      }
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Get Single News.
 */
const GetSingleNews = async (req, res) => {
  try {
    const id = req.params.id;
    var usersArray = [];
    let True = true;
    const data = await News.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === id && True) {
          True = false;
          const Data = doc.data(usersArray.id);
          const Content = Data.Content;
          const file = Data.file;
          const Date = Data.Date;
          const Title = Data.Title;
          const id = doc.id;
          const url = Data.url;
          const algoliaID = Data.algoliaID;
          usersArray.push(doc.data());
          const NewsData = {
            id,
            Content,
            Date,
            Title,
            file,
            url,
            algoliaID,
          };
          res.status(200).send({
            msg: "Get Single News Successfully",
            GetSingleNews: NewsData,
          });
        }
      });
      let Condition = true;
      snapshot.forEach((doc) => {
        if (doc.id !== id && True && Condition) {
          Condition = false;
          res.status(400).send({
            msg: "User Not Found ",
          });
        }
      });
    });
  } catch (error) {
    res.status(400).send({ msg: "News Not Found" });
  }
};
/**
 * The following Api contains source code for a Delete News.
 */
const DeleteNews = async (req, res) => {
  const id = req.body.id;
  const AlgoliaID = req.body.AlgoliaID;
  const GetNews = News.doc(id);
  const GetData = await GetNews.get();
  if (GetData.exists) {
    await News.doc(id).delete();
    index
      .deleteObject(AlgoliaID)
      .then(() => {
        console.log(`Object ${AlgoliaID} was deleted`);
      })
      .catch((error) => {
        console.error(`Error deleting object ${AlgoliaID}:`, error);
      });
    res.status(200).send({ msg: "News Deleted Successfully" });
  } else {
    res.status(400).send({ msg: "Oops! User Not Found" });
  }
};
module.exports = {
  createNews,
  UpdateNews,
  updateNewsImage,
  GetAllNews,
  GetSingleNews,
  DeleteNews,
};
