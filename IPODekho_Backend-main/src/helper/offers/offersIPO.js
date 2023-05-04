const { firestore } = require("../../config/firestoreCloud");
const express = require("express");
const webApp = express();
const saltedMd5 = require("salted-md5");
const path = require("path");
var admin = require("firebase-admin");
const offers = firestore.collection("Offers");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("FGYOEUJ8DR", "ad1139d39fa664e5969253e8f33b698f");
const index = client.initIndex("IPOOffers");
webApp.locals.bucket = admin.storage().bucket();
/**
 * The following Api contains source code for a Create Offers.
 */
const createOffer = async (req, res, body) => {
  try {
    if (req.file) {
      const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      const fileName = name + path.extname(req.file.originalname);
      await webApp.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(req.file.buffer);
      const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
      const OfferIPO = {
        offerTitle: req.body.offerTitle || "",
        offerDescription: req.body.offerDescription || "",
        offerSequence: Number(req.body.offerSequence),
        offerStatus: req.body.offerStatus || "",
        offerLink: req.body.offerLink || "",
        url: req.body.url || "",
        createdAt: new Date(),
        file: file,
      };
      if (OfferIPO) {
        const algoliaResponse = await index.saveObject(OfferIPO, {
          autoGenerateObjectIDIfNotExist: true,
        });
        console.log(algoliaResponse, "algoliaResponse");
        const record = {
          ...OfferIPO,
          algoliaID: algoliaResponse.objectID,
        };
        await offers.add(record);
        const algoliaID = { algoliaID: algoliaResponse.objectID };
        const Data = Object.assign(record, algoliaID);
        res.status(200).send({
          msg: "Offer Created Successfully",
          data: Data,
        });
      } else {
        res.status(300).send({ msg: "Offer Not Created" });
      }
    } else {
      const Data = {
        offerTitle: req.body.offerTitle || "",
        offerDescription: req.body.offerDescription || "",
        offerLink: req.body.offerLink || "",
        offerSequence: Number(req.body.offerSequence) || "",
        offerStatus: req.body.offerStatus || "",
        url: req.body.url || "",
        createdAt: new Date(),
      };
      console.log(isNaN(Data?.offerSequence));
      if (Data) {
        const algoliaResponse = await index.saveObject(Data, {
          autoGenerateObjectIDIfNotExist: true,
        });
        console.log(algoliaResponse, "algoliaResponse");
        const record = {
          ...Data,
          algoliaID: algoliaResponse.objectID,
        };
        await offers.add(record);
        const algoliaID = { algoliaID: algoliaResponse.objectID };
        const data = Object.assign(record, algoliaID);
        res.status(200).send({
          msg: "Offer Created Successfully",
          data: data,
        });
      } else {
        res.status(300).send({ msg: "Offer Not Found" });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
/**
 * The following Api contains source code for a Update Offers.
 */
const UpdateOffer = async (req, res) => {
  try {
    const id = req.params.id;
    const objectID = req.body.algoliaID;
    delete req.params.id;
    const GetOffer = offers.doc(id);
    const GetData = await GetOffer.get();
    const Data = {
      offerTitle: req.body.offerTitle || "",
      offerDescription: req.body.offerDescription || "",
      offerSequence: Number(req.body.offerSequence) || "",
      offerStatus: req.body.offerStatus || "",
      offerLink: req.body.offerLink || "",
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
      await offers.doc(id).update(Data, { new: true });
      res.status(200).send({ msg: "Offer updated Successfully", data: Data });
    } else {
      res.status(300).send({ msg: "UserId Not Found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
/**
 * The following Api contains source code for a Update Image.
 */
const updateImage = async (req, res) => {
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
      const GetOffer = offers.doc(id);
      const GetData = await GetOffer.get();
      const file =
        `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744` ||
        "";
      const updateFile = {
        file: file,
        id: id,
        algoliaID: objectID,
      };

      const get = GetData.data();
      const recordd = {
        offerTitle: get.offerTitle,
        offerDescription: get.offerDescription,
        offerSequence: get.offerSequence,
        offerStatus: get.offerStatus,
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
        await offers.doc(id).update({ file: file });
        res
          .status(200)
          .send({ msg: "Offer-Image Updated Successfully", file: updateFile });
      }
    } else if (req.file == null) {
      const id = req.params.id;
      delete req.params.id;
      const GetOffers = offers.doc(id);
      const GetData = await GetOffers.get();
      const updateFile = {
        file: "",
        id: id,
      };
      if (GetData.exists) {
        await offers.doc(id).update(updateFile, { new: true });
        res
          .status(200)
          .send({ msg: "Image Updated Successfully", data: updateFile });
      } else {
        res.status(300).send({ msg: "Image Not Found" });
      }
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Get All Offers.
 */
const GetAllOffer = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    let page = req.query.page || 1;
    const search = req.body.search;
    if (req.body.search) {
      const GetOffer = await offers.select(
        "offerTitle",
        "offerDescription",
        "offerSequence",
        "url",
        "offerStatus",
        "file",
        "offerLink",
        "algoliaID"
      );
      GetOffer.offset(Number(page - 1) * limit)
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
          GetOffer.get().then((querySnapshot) => {
            let Total = querySnapshot.size;
            index
              .search(search, { hitsPerPage: 10, attributesToHighlight: [] })
              .then(({ hits }) => {
                // const hits = MainLineIpo;
                const AllOffers = { AllOffers: hits };
                res.status(200).send({
                  msg: "All Offers Get Successfully",
                  data: AllOffers,
                });
              });
          });
        });
    } else {
      const GetOffer = await offers.select(
        "offerTitle",
        "offerDescription",
        "offerSequence",
        "url",
        "offerStatus",
        "file",
        "offerLink",
        "algoliaID"
      );
      if (GetOffer) {
        GetOffer.offset(Number(page - 1) * limit)
          .limit(Number(limit))
          .orderBy("offerSequence", "asc")
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.size === 0) {
              res.status(200).send({ msg: "No more documents left" });
              return;
            }
            const AllOffers = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            offers.get().then((querySnapshot) => {
              let Total = querySnapshot.size;
              const Merged = { AllOffers, Total };
              res
                .status(200)
                .send({ msg: "All Offers Get Successfully", data: Merged });
            });
          });
      } else {
        res.status(200).send({ msg: "Not Get All Offers", data: Merged });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
/**
 * The following Api contains source code for a Get Single Offer.
 */
const GetISingleOffer = async (req, res) => {
  try {
    const id = req.params.id;
    var usersArray = [];
    let True = true;
    const data = await offers.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === id && True) {
          True = false;
          const Data = doc.data(usersArray.id);
          const offerTitle = Data.offerTitle;
          const offerDescription = Data.offerDescription;
          const offerSequence = Data.offerSequence;
          const url = Data.url;
          const offerStatus = Data.offerStatus;
          const file = Data.file;
          const offerLink = Data.offerLink;
          const id = doc.id;
          const algoliaID = Data.algoliaID;
          usersArray.push(doc.data());
          const OfferData = {
            id,
            offerTitle,
            offerDescription,
            offerLink,
            offerSequence,
            url,
            offerStatus,
            file,
            algoliaID,
          };
          res.status(200).send({
            msg: "Get Single Offer Successfully",
            GetSingleOffer: OfferData,
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
    res.status(400).send({ msg: "Offer Not Found" });
  }
};
/**
 * The following Api contains source code for a Delete Offers.
 */
const DeleteOffer = async (req, res) => {
  try {
    const id = req.body.id;
    const AlgoliaID = req.body.algoliaID;
    const GetOffer = offers.doc(id);
    const GetData = await GetOffer.get();
    if (GetData.exists) {
      await offers.doc(id).delete();
      index
        .deleteObject(AlgoliaID)
        .then(() => {
          console.log(`Object ${AlgoliaID} was deleted`);
        })
        .catch((error) => {
          console.error(`Error deleting object ${AlgoliaID}:`, error);
        });
      res.status(200).send({ msg: "Offer Deleted Successfully" });
    } else {
      res.status(400).send({ msg: "Oops! User Not Found" });
    }
  } catch (error) {
    res.status(400).send({ msg: "Offer Not Found" });
  }
};
module.exports = {
  createOffer,
  UpdateOffer,
  updateImage,
  GetAllOffer,
  GetISingleOffer,
  DeleteOffer,
};
