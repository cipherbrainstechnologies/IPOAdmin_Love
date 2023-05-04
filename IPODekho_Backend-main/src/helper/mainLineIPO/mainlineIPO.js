const { firestore } = require("../../config/firestoreCloud");
const express = require("express");
const webApp = express();
const saltedMd5 = require("salted-md5");
const path = require("path");
var admin = require("firebase-admin");
const Tokens = firestore.collection("Tokens");
const userInformation = firestore.collection("MainLineIPO");
const messageCollection = firestore.collection("messageCollection");
const algoliasearch = require("algoliasearch");
const FCM = require("fcm-node");
const { log } = require("console");
const client = algoliasearch("FGYOEUJ8DR", "ad1139d39fa664e5969253e8f33b698f");
const index = client.initIndex("IPOSearch");
const SMEIPO = client.initIndex("SmeIPO");
/**
 * The following Api contains source code for a Create 2 Type IPO in This Code MainLineIPO,SmeIPO
 * And In This Code Updated 2 Type IPO in This Code MainLineIPO,SmeIPO.
 */
const createMainlineIPO = async (req, res, body) => {
  try {
    const id = req.params.id;
    const objectID = req.body.algoliaID;
    delete req.params.id;
    const GetIpo = userInformation.doc(id);
    const GetData = await GetIpo.get();
    const get = GetData.data();
    const GeneralIPO = req.body;
    if (GetData.exists) {
      const updatedAt = new Date();
      const Merged = {
        ...GeneralIPO,
        updatedAt,
      };
      if (GeneralIPO.CategoryForIPOS == "MainlineIPO") {
        const recordd = {
          companyName: Merged.companyName || get.companyName,
          IPOOpenDate: Merged.IPOOpenDate || get.IPOOpenDate,
          IPOCloseDate: Merged.IPOCloseDate || get.IPOCloseDate,
          lotSize: Merged.lotSize || get.lotSize,
          GMPStatus: Merged.GMPStatus || get.GMPStatus,
          GMP: Merged.GMP || get.GMP,
          IPOStatus: Merged.IPOStatus || get.IPOStatus,
          fromPrice: Merged.fromPrice || get.fromPrice,
          toPrice: Merged.toPrice || get.toPrice,
          file: get.file,
          id: Merged.id,
        };
        recordd.objectID = objectID;
        index
          .saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            console.log(`Record with ID ${objectID} was updated in Algolia`);
          })
          .catch((error) => {
            console.error(`Error updating record with ID ${id}:`, error);
          });
        await userInformation.doc(id).update(Merged, { new: true });
        res.status(200).send({
          msg: `${GeneralIPO.CategoryForIPOS} Updated Successfully`,
          data: GeneralIPO,
        });
      } else if (GeneralIPO.CategoryForIPOS == "SmeIPO") {
        const recordd = {
          companyName: Merged.companyName || get.companyName,
          IPOOpenDate: Merged.IPOOpenDate || get.IPOOpenDate,
          IPOCloseDate: Merged.IPOCloseDate || get.IPOCloseDate,
          lotSize: Merged.lotSize || get.lotSize,
          GMPStatus: Merged.GMPStatus || get.GMPStatus,
          GMP: Merged.GMP || get.GMP,
          IPOStatus: Merged.IPOStatus || get.IPOStatus,
          fromPrice: Merged.fromPrice || get.fromPrice,
          toPrice: Merged.toPrice || get.toPrice,
          file: get.file,
          id: Merged.id,
        };
        recordd.objectID = objectID;
        SMEIPO.saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            console.log(`Record with ID ${objectID} was updated in Algolia`);
          })
          .catch((error) => {
            console.error(`Error updating record with ID ${id}:`, error);
          });
        await userInformation.doc(id).update(Merged, { new: true });
        res.status(200).send({
          msg: `${GeneralIPO.CategoryForIPOS} Updated Successfully`,
          data: GeneralIPO,
        });
      }
    } else {
      const GeneralIPOData = req.body;
      if (GeneralIPOData) {
        console.log("gg");
        const createdAt = new Date();
        const Merged = { ...GeneralIPOData, createdAt };
        console.log(Merged);
        const get = GetData.data();
        console.log(GeneralIPOData.CategoryForIPOS);
        if (GeneralIPOData.CategoryForIPOS == "MainlineIPO") {
          const recordd = {
            companyName: Merged.companyName,
            IPOOpenDate: Merged.IPOOpenDate,
            lotSize: Merged.lotSize,
            GMPStatus: Merged.GMPStatus,
            GMP: Merged.GMP,
            IPOStatus: Merged.IPOStatus,
            fromPrice: Merged.fromPrice,
            toPrice: Merged.toPrice,
            id: Merged.id,
          };
          console.log(recordd);
          const algoliaResponse = await index.saveObject(recordd, {
            autoGenerateObjectIDIfNotExist: true,
          });
          console.log(algoliaResponse, "algoliaResponse");
          const CreatedAt = { createdAt: createdAt };
          const record = {
            ...Merged,
            algoliaID: algoliaResponse.objectID,
          };
          console.log(record, "recordrecord");
          const id = await userInformation.add(record);
          const ids = { id: id.id };
          const algoliaID = { algoliaID: algoliaResponse.objectID };

          const Data = Object.assign(record, ids, algoliaID, CreatedAt);
          console.log(Data, "aaaaa");
          res.status(200).send({
            msg: `${GeneralIPOData.CategoryForIPOS} Created Successfully`,
            data: Data,
          });
        } else if (GeneralIPOData.CategoryForIPOS == "SmeIPO") {
          const recordd = {
            companyName: Merged.companyName,
            IPOOpenDate: Merged.IPOOpenDate,
            lotSize: Merged.lotSize,
            GMPStatus: Merged.GMPStatus,
            GMP: Merged.GMP,
            IPOStatus: Merged.IPOStatus,
            fromPrice: Merged.fromPrice,
            toPrice: Merged.toPrice,
            id: Merged.id,
          };
          console.log(recordd);
          const algoliaResponse = await SMEIPO.saveObject(recordd, {
            autoGenerateObjectIDIfNotExist: true,
          });
          console.log(algoliaResponse, "algoliaResponse");
          const CreatedAt = { createdAt: createdAt };
          const record = {
            ...Merged,
            algoliaID: algoliaResponse.objectID,
          };
          console.log(record, "recordrecord");
          const id = await userInformation.add(record);
          const ids = { id: id.id };
          const algoliaID = { algoliaID: algoliaResponse.objectID };
          const Data = Object.assign(record, ids, algoliaID, CreatedAt);
          console.log(Data, "aaaaa");
          res.status(200).send({
            msg: `${GeneralIPOData.CategoryForIPOS} Created Successfully`,
            data: Data,
          });
        }
      } else {
        res.status(300).send({ msg: "IPO Not Found" });
      }
    }
    webApp.locals.bucket = admin.storage().bucket();
  } catch (error) {
    res.status(400).send(error);
  }
};
/**
 * The following Api contains source code for a GetAll IPo
 * Search By Keyword
 * Filter Data BY IPO Status
 */
const GetMainLineIpo = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    let page = req.query.page || 1;
    const CategoryForIPOS = req.body.CategoryForIPOS;
    const keyword = req.body.keyword;
    const Filter = req.body.Filter;
    const search = req.body.search;
    /*
      Search Data For IPO
      **/
    if (req.body.Filter) {
      const IPOStatus = await userInformation
        .where("CategoryForIPOS", "==", CategoryForIPOS)
        .where("IPOStatus", "==", Filter)
        .select(
          "CategoryForIPOS",
          "companyName",
          "IPOOpenDate",
          "IPOCloseDate",
          "lotSize",
          "GMPStatus",
          "GMP",
          "IPOStatus",
          "fromPrice",
          "toPrice",
          "file",
          "disclaimer",
          "secondDate",
          "Thirddate"
        );
      IPOStatus.offset(Number(page - 1) * limit)
        .limit(Number(limit))
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            res.status(200).send({ msg: "No more documents left" });
            return;
          }
          const MainLineIpo = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          IPOStatus.get().then((querySnapshot) => {
            let Total = querySnapshot.size;
            const Merged = { MainLineIpo, Total };
            res.status(200).send({ msg: "All IPOS", data: Merged });
          });
        });
    } else if (search) {
      const IPOStatus = await userInformation
        .where("CategoryForIPOS", "==", CategoryForIPOS)
        .select(
          "CategoryForIPOS",
          "companyName",
          "IPOOpenDate",
          "IPOCloseDate",
          "lotSize",
          "GMPStatus",
          "GMP",
          "IPOStatus",
          "fromPrice",
          "toPrice",
          "file",
          "disclaimer",
          "secondDate",
          "Thirddate"
        );
      IPOStatus.offset(Number(page - 1) * limit)
        .limit(Number(limit))
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            res.status(200).send({ msg: "No more documents left" });
            return;
          }
          const MainLineIpo = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          IPOStatus.get().then((querySnapshot) => {
            let Total = querySnapshot.size;
            const Merged = { MainLineIpo, Total };
            if (CategoryForIPOS == "MainlineIPO") {
              index.setSettings({
                searchableAttributes: [
                  "companyName",
                  "IPOOpenDate",
                  "IPOCloseDate",
                  "lotSize",
                  "GMPStatus",
                  "IPOStatus",
                  "fromPrice",
                  "toPrice",
                  "disclaimer",
                  "secondDate",
                  "Thirddate",
                  // add all other attributes you want to search across here
                ],
                attributesForFaceting: [
                  "numeric(fromPrice)",
                  "numeric(toPrice)",
                  "numeric(lotSize)",
                ],
              });
              index
                .search(search, { hitsPerPage: 10, attributesToHighlight: [] })
                .then(({ hits }) => {
                  const MainLineIpo = { MainLineIpo: hits };
                  res.status(200).send({ msg: "All IPOS", data: MainLineIpo });
                });
            } else if (CategoryForIPOS == "SmeIPO") {
              index.setSettings({
                searchableAttributes: [
                  "companyName",
                  "IPOOpenDate",
                  "IPOCloseDate",
                  "lotSize",
                  "GMPStatus",
                  "IPOStatus",
                  "fromPrice",
                  "toPrice",
                  "disclaimer",
                  "secondDate",
                  "Thirddate",
                  // add all other attributes you want to search across here
                ],
                attributesForFaceting: [
                  "numeric(fromPrice)",
                  "numeric(toPrice)",
                  "numeric(lotSize)",
                ],
              });
              SMEIPO.search(search, {
                hitsPerPage: 10,
                attributesToHighlight: [],
              }).then(({ hits }) => {
                const MainLineIpo = { MainLineIpo: hits };
                res.status(200).send({ msg: "All IPOS", data: MainLineIpo });
              });
            }
          });
        });
    } else {
      /*
      GetAll
      Data For IPO
      **/
      const GetIpo = await userInformation
        .where("CategoryForIPOS", "==", CategoryForIPOS)
        // .orderBy("createdAt", "dec")
        .select(
          "CategoryForIPOS",
          "companyName",
          "IPOOpenDate",
          "IPOCloseDate",
          "lotSize",
          "GMPStatus",
          "GMP",
          "IPOStatus",
          "fromPrice",
          "toPrice",
          "file",
          "disclaimer",
          "algoliaID",
          "createdAt",
          "secondDate",
          "Thirddate"
        );
      GetIpo.offset(Number(page - 1) * limit)
        .limit(Number(limit))
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size == 0) {
            // No more documents left
            res.status(200).send({ msg: "No more documents left" });
            return;
          }
          const MainLineIpo = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          GetIpo.get().then((querySnapshot) => {
            let Total = querySnapshot.size;
            const Merged = { MainLineIpo, Total };
            res.status(200).send({ msg: "All IPOS", data: Merged });
          });
        });
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Get Single IPO.
 */
const GetIdByMainLineIpo = async (req, res) => {
  try {
    const id = req.params.id;
    const CategoryForIPOS = req.body.CategoryForIPOS;
    var usersArray = [];
    let True = true;
    const data = await userInformation.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id == id && True) {
          True = false;
          const Data = doc.data();
          if (Data.CategoryForIPOS === CategoryForIPOS) {
            //MainLineIPO Genral
            const id = doc.id;
            const disclaimer = Data.disclaimer;
            const secondDate = Data.secondDate;
            const Thirddate = Data.Thirddate;
            const algoliaID = Data.algoliaID;
            const checkAllotment = Data.checkAllotment;
            const preIssueShareHolding = Data.preIssueShareHolding;
            const reatailQuota = Data.reatailQuota;
            const qibQuota = Data.qibQuota;
            const DRHPDraft = Data.DRHPDraft;
            const companyDescription = Data.companyDescription;
            const freshIssue = Data.freshIssue;
            const fromPrice = Data.fromPrice;
            const ObjectOfIssue = Data.ObjectOfIssue;
            const postIssueShareHolding = Data.postIssueShareHolding;
            const issueSize = Data.issueSize;
            const RHPDraft = Data.RHPDraft;
            const promotersName = Data.promotersName;
            const faceValue = Data.faceValue;
            const toPrice = Data.toPrice;
            const issueType = Data.issueType;
            const companyName = Data.companyName;
            const nilQuota = Data.nilQuota;
            const listingAt = Data.listingAt;
            const offerForSale = Data.offerForSale;
            const lotSize = Data.lotSize;
            const checkLiveSubscriptionUrl = Data.checkLiveSubscriptionUrl;
            const subscriptionDateAndTime = Data.subscriptionDateAndTime;
            //MainLineIPO Financial
            const earningPerShare = Data.earningPerShare;
            const peersComparison = Data.peersComparison;
            const financialLotsize = Data.financialLotsize;
            const returnonNetWorth = Data.returnonNetWorth;
            const companyFinancials = Data.companyFinancials;
            const netAssetValue = Data.netAssetValue;
            const earningPERatio = Data.earningPERatio;
            //MainLineIPO Subscription
            const sNII = Data.sNII;
            const others = Data.others;
            const total = Data.total;
            const subscriptionDetails = Data.subscriptionDetails;
            const retailInvestors = Data.retailInvestors;
            const qualifiedInstitutions = Data.qualifiedInstitutions;
            const employees = Data.employees;
            const bNII = Data.bNII;
            const nonInstitutionalBuyers = Data.nonInstitutionalBuyers;
            //MainLineIPO ListingInfo
            const scriptPosition = Data.scriptPosition;
            const closingDifferent = Data.closingDifferent;
            const listingDifferent = Data.listingDifferent;
            const BSEScript = Data.BSEScript;
            const closingPrice = Data.closingPrice;
            const listingPrice = Data.listingPrice;
            const listingPosition = Data.listingPosition;
            const weekLow = Data.weekLow;
            const NSECode = Data.NSECode;
            const closingDate = Data.closingDate;
            const listingDate = Data.listingDate;
            const weekHigh = Data.weekHigh;

            //MainLineIPO CompanyRegisterInfo
            const registerPhone = Data.registerPhone;
            const address = Data.address;
            const registerEmail = Data.registerEmail;
            const registerName = Data.registerName;
            const companyPhone = Data.companyPhone;
            const email = Data.email;
            const registerWebsite = Data.registerWebsite;
            const allotmentLink = Data.allotmentLink;
            const website = Data.website;

            //Status
            const IPOstatus = Data.IPOStatus;
            const CategoryForIPOS = Data.CategoryForIPOS;
            //Tentative Timetable
            const IPOOpenDate = Data.IPOOpenDate;
            const IPOCloseDate = Data.IPOCloseDate;
            const IPOAllotmentDate = Data.IPOAllotmentDate;
            const IPORefundsInitiation = Data.IPORefundsInitiation;
            const IPODematTransfer = Data.IPODematTransfer;
            const IPOListingDate = Data.IPOListingDate;
            const chatRoomId = Data.chatRoomId;
            const shortText = Data.shortText;
            const file = Data.file;
            usersArray.push(doc.data());
            const General = {
              disclaimer,
              secondDate,
              Thirddate,
              algoliaID,
              checkAllotment,
              chatRoomId,
              shortText,
              IPOOpenDate,
              IPOCloseDate,
              IPOAllotmentDate,
              IPORefundsInitiation,
              IPODematTransfer,
              IPOListingDate,
              IPOstatus,
              preIssueShareHolding,
              reatailQuota,
              qibQuota,
              DRHPDraft,
              companyDescription,
              freshIssue,
              fromPrice,
              ObjectOfIssue,
              postIssueShareHolding,
              issueSize,
              RHPDraft,
              promotersName,
              faceValue,
              toPrice,
              issueType,
              companyName,
              nilQuota,
              listingAt,
              offerForSale,
              lotSize,
              earningPerShare,
              peersComparison,
              financialLotsize,
              returnonNetWorth,
              companyFinancials,
              netAssetValue,
              earningPERatio,
              sNII,
              others,
              total,
              subscriptionDetails,
              retailInvestors,
              qualifiedInstitutions,
              employees,
              bNII,
              nonInstitutionalBuyers,
              registerPhone,
              address,
              registerEmail,
              registerName,
              companyPhone,
              email,
              registerWebsite,
              allotmentLink,
              website,
              scriptPosition,
              closingDifferent,
              listingDifferent,
              BSEScript,
              closingPrice,
              listingPrice,
              listingPosition,
              weekLow,
              NSECode,
              closingDate,
              listingDate,
              weekHigh,
              id,
              CategoryForIPOS,
              file,
              checkLiveSubscriptionUrl,
              subscriptionDateAndTime,
            };
            res.status(200).send({
              msg: `${CategoryForIPOS}IPO Get Successfully`,
              IPODetails: General,
            });
          } else {
            res.status(300).send({
              msg: "IPO Category Not Found",
            });
          }
        }
      });
      let Condition = true;
      snapshot.forEach((doc) => {
        if (doc.id !== id && True && Condition) {
          Condition = false;
          res.status(400).send({
            msg: "User Not Get",
          });
        }
      });
    });
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Update IPO.
 */
const UpdateMainLineIpo = async (req, res) => {
  try {
    const fcm = new FCM(
      "AAAA2MoJTos:APA91bHlpbZR1jxLqlkda5Th7MkrLzq29LgZMhfOXotO_0yOXTJe6-pCFCTQBqCk0d1xe7oggllZhfqgqCRDD9rpsIJ4bs_dSHF_nl55V3iPsFIWjPyaR1qFak1AcwCw_oxRa4hpqvGj"
    );
    const objectID = req.body.algoliaID;
    const id = req.params.id;
    delete req.params.id;
    const GetIpo = userInformation.doc(id);
    const GetData = await GetIpo.get();
    const get = GetData.data();
    const data = req.body;
    if (GetData.exists) {
      const name = data.companyName || "-";
      if (data.CategoryForIPOS == "MainlineIPO") {
        const recordd = {
          companyName: data.companyName || get.companyName,
          IPOOpenDate: data.IPOOpenDate || get.IPOOpenDate,
          IPOCloseDate: data.IPOCloseDate || get.IPOCloseDate,
          lotSize: data.lotSize || get.lotSize,
          GMPStatus: data.GMPStatus || get.GMPStatus,
          GMP: data.GMP || get.GMP,
          IPOStatus: data.IPOStatus || get.IPOStatus,
          fromPrice: data.fromPrice || get.fromPrice,
          toPrice: data.toPrice || get.toPrice,
          file: get.file,
          id: data.id,
        };
        recordd.objectID = objectID;
        index
          .saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            console.log(`Record with ID ${objectID} was updated in Algolia`);
          })
          .catch((error) => {
            console.error(`Error updating record with ID ${id}:`, error);
          });
      } else if (data.CategoryForIPOS == "SmeIPO") {
        const recordd = {
          companyName: data.companyName || get.companyName,
          IPOOpenDate: data.IPOOpenDate || get.IPOOpenDate,
          IPOCloseDate: data.IPOCloseDate || get.IPOCloseDate,
          lotSize: data.lotSize || get.lotSize,
          GMPStatus: data.GMPStatus || get.GMPStatus,
          GMP: data.GMP || get.GMP,
          IPOStatus: data.IPOStatus || get.IPOStatus,
          fromPrice: data.fromPrice || get.fromPrice,
          toPrice: data.toPrice || get.toPrice,
          file: get.file,
          id: data.id,
        };
        recordd.objectID = objectID;
        SMEIPO.saveObject(recordd, {
          autoGenerateObjectIDIfNotExist: true,
        })
          .then(() => {
            console.log(`Record with ID ${objectID} was updated in Algolia`);
          })
          .catch((error) => {
            console.error(`Error updating record with ID ${id}:`, error);
          });
      }
      userInformation.doc(id).update(data, { new: true });
      res.status(200).send({ msg: "Ipo updated Successfully", data: data });
    } else {
      res.status(300).send({ msg: "UserId Not Found" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(400).send({ msg: "User Not Found" });
  }
};
// const UpdateMainLineIpo = async (req, res) => {
//   try {
//     const id = req.params.id;
//     delete req.params.id;
//     const GetIpo = userInformation.doc(id);

//     const GetData = await GetIpo.get();
//     const data = req.body;
//     if (GetData.exists) {
//       await userInformation.doc(id).update(data, { new: true });
//       res.status(200).send({ msg: "Ipo updated Successfully", data: data });
//     } else {
//       res.status(300).send({ msg: "UserId Not Found" });
//     }
//   } catch (error) {
//     res.status(400).send({ msg: "User Not Found" });
//   }
// };
/**
 * The following Api contains source code for a Delete IPO.
 */
const DeleteMainLineIpo = async (req, res) => {
  try {
    const id = req.body.id;
    const GetIpo = await userInformation.doc(id);
    const AlgoliaID = req.body.AlgoliaID;
    const GetData = await GetIpo.get();
    if (GetData.exists) {
      await userInformation.doc(id).delete();
      // const index = client.initIndex("IPOSearch");
      const objectID = id; // the object ID of the record to delete
      index
        .deleteObject(objectID)
        .then((res) => {
          console.log(`Record with ID ${objectID} deleted successfully`);
        })
        .catch((err) => {
          console.error(err);
        });
      SMEIPO.deleteObject(objectID)
        .then((res) => {
          console.log(`Record with ID ${objectID} deleted successfully`);
        })
        .catch((err) => {
          console.error(err);
        });
      res.status(200).send({ msg: "User Deleted Successfully" });
    } else {
      res.status(400).send({ msg: "Oops! User Not Found" });
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Upload Image.
 */
webApp.locals.bucket = admin.storage().bucket();
const uploadImage = async (req, res) => {
  try {
    const id = req.params.id;
    const objectID = req.body.algoliaID;
    const GetIpo = userInformation.doc(id);
    const GetData = await GetIpo.get();
    const get = GetData.data();
    if (req.file) {
      const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      const fileName = name + path.extname(req.file.originalname);
      await webApp.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(req.file.buffer);
      const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
        const createdAt = new Date();
      if (GetData.exists) {
      
        const merged = Object.assign({
          file: file,
          id: id,
          algoliaID: objectID,
           createdAt: createdAt,
        });

        if (get.CategoryForIPOS == "MainlineIPO") {
          const recordd = {
            companyName: get.companyName,
            IPOOpenDate: get.IPOOpenDate,
            lotSize: get.lotSize,
            GMPStatus: get.GMPStatus,
            GMP: get.GMP,
            IPOStatus: get.IPOStatus,
            fromPrice: get.fromPrice,
            toPrice: get.toPrice,
            file: merged.file,
            id: get.id,
          };
          recordd.objectID = objectID;

          console.log((recordd.objectID = objectID));
          index
            .saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
            .then(() => {
              console.log(`Record with ID ${objectID} was updated in Algolia`);
            })
            .catch((error) => {
              console.error(`Error updating record with ID ${id}:`, error);
            });
          await userInformation.doc(id).update({ file: file });
          res
            .status(200)
            .send({ msg: "Image Uploaded Successfully", data: merged });
        } else if (get.CategoryForIPOS == "SmeIPO") {
          const recordd = {
            companyName: get.companyName,
            IPOOpenDate: get.IPOOpenDate,
            lotSize: get.lotSize,
            GMPStatus: get.GMPStatus,
            GMP: get.GMP,
            IPOStatus: get.IPOStatus,
            fromPrice: get.fromPrice,
            toPrice: get.toPrice,
            file: merged.file,
            id: get.id,
          };
          recordd.objectID = objectID;
          console.log((recordd.objectID = objectID));
          SMEIPO.saveObject(recordd, { autoGenerateObjectIDIfNotExist: true })
            .then(() => {
              console.log(`Record with ID ${objectID} was updated in Algolia`);
            })
            .catch((error) => {
              console.error(`Error updating record with ID ${id}:`, error);
            });
          await userInformation.doc(id).update({ file: file });
          res
            .status(200)
            .send({ msg: "Image Uploaded Successfully", data: merged });
        }
        // console.log(get);
      } else {
        console.log("CategoryForIPOS");
        const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
        const fileName = name + path.extname(req.file.originalname);
        await webApp.locals.bucket
          .file(fileName)
          .createWriteStream()
          .end(req.file.buffer);
        const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
        const data = req.body;
        const CategoryForIPOS = data.CategoryForIPOS;
         const createdAt = new Date();
        console.log(CategoryForIPOS, "CategoryForIPOS");
        const file1 = {
          file: file,
          CategoryForIPOS: CategoryForIPOS,
           createdAt: createdAt,
        };
        if (CategoryForIPOS == "MainlineIPO") {
          const algoliaResponse = await index.saveObject(file1, {
            autoGenerateObjectIDIfNotExist: true,
          });
          const record = {
            ...file1,
            algoliaID: algoliaResponse.objectID,
          };
          const id = await userInformation.add(record);
          const ids = { id: id.id };
          const merged = Object.assign({
            file: file,
            id: id.id,
            algoliaID: record.algoliaID,
          });
          res.status(200).send({
            msg: "Image Uploaded Successfully",
            data: merged,
          });
        } else if (get.CategoryForIPOS == "SmeIPO") {
          const algoliaResponse = await SMEIPO.saveObject(file1, {
            autoGenerateObjectIDIfNotExist: true,
          });
          const record = {
            ...file1,
            algoliaID: algoliaResponse.objectID,
          };
          const id = await userInformation.add(record);
          const ids = { id: id.id };
          const merged = Object.assign({
            file: file,
            id: id.id,
            algoliaID: record.algoliaID,
          });
          res.status(200).send({
            msg: "Image Uploaded Successfully",
            data: merged,
          });
        }
      }
    } else if (req.file == null) {
      const id = req.params.id;
      delete req.params.id;
      const GetIpo = userInformation.doc(id);
      const GetData = await GetIpo.get();
      const file = req.file;
      const updateFile = {
        file: "",
        id: id,
      };
      if (GetData.exists) {
        await userInformation.doc(id).update(updateFile, { new: true });
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
 * The following Api contains source code for Get Single Image.
 */
const GetImage = async (req, res) => {
  try {
    const id = req.params.id;
    var usersArray = [];
    let True = true;
    const data = await userInformation.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === id && True) {
          True = false;
          const Data = doc.data(usersArray.id);
          const File = Data.file;
          usersArray.push(doc.data());
          res.status(200).send({
            msg: "File Get Successfully",
            Image: File,
          });
        }
      });
      let Condition = true;
      snapshot.forEach((doc) => {
        if (doc.id !== id && True && Condition) {
          Condition = false;
          res.status(400).send({
            msg: "Image Not Get",
          });
        }
      });
    });
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
//delete Sme And MainLine
const DeleteIPO = async (req, res) => {
  const id = req.body.id;
  const AlgoliaID = req.body.algoliaID;
  const IPOId = userInformation.doc(id);
  const GetData = await IPOId.get();
  if (GetData.exists) {
    await userInformation.doc(id).delete();
    index
      .deleteObject(AlgoliaID)
      .then(() => {
        console.log(`Object ${AlgoliaID} was deleted`);
      })
      .catch((error) => {
        console.error(`Error deleting object ${AlgoliaID}:`, error);
      });
    SMEIPO.deleteObject(AlgoliaID)
      .then(() => {
        console.log(`Object ${AlgoliaID} was deleted`);
      })
      .catch((error) => {
        console.error(`Error deleting object ${AlgoliaID}:`, error);
      });
    res.status(200).send({ msg: "IPO Deleted Successfully" });
  } else {
    res.status(400).send({ msg: "Oops! User Not Found" });
  }
};
module.exports = {
  createMainlineIPO,
  GetMainLineIpo,
  UpdateMainLineIpo,
  DeleteMainLineIpo,
  GetIdByMainLineIpo,
  uploadImage,
  GetImage,
  DeleteIPO,
};
