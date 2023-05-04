const { firestore } = require("../../config/firestoreCloud");
const express = require("express");
const webApp = express();
const saltedMd5 = require("salted-md5");
const path = require("path");
var admin = require("firebase-admin");
const base64ToImage = require("base64-to-image");
/**
 * The following Api contains source code for a Update Profile With Google Authentication.
 */
webApp.locals.bucket = admin.storage().bucket();
const getImage = async (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: "uploads/profile" });
};
const UpdateProfile = async (req, res, body) => {
  try {
    const str = req.body.photoURL;
    const base64Str = str.slice(0, -1);
    if (req.body.photoURL) {
      const path = "./uploads/profile/";
      const optionalObj = {
        fileName: "",
        type: base64Str.split(";")[0].split("/")[1],
      };
      const imageInfo = base64ToImage(base64Str, path, optionalObj);
      const filePath = `http://13.234.12.69:6000/uploads/profile/${imageInfo.fileName}`;
      const uid = req.body.id;
      admin
        .auth()
        .updateUser(
          uid,
          {
            displayName: req.body.displayName,
            photoURL: filePath,
            phoneNumber: req.body.phoneNumber || "",
            email: req.body.email,
          },
          { merge: true },
          { new: true }
        )
        .then((data) => {
          if (data) {
            return res.status(201).send({
              msg: "Profile Updated SuccessFully",
              data: data,
            });
          } else {
            return res.status(300).send({
              msg: "The user with the provided phone number Already exists",
            });
          }
        })
        .catch((error) => {
          return res.status(400).send({
            msg: error.errorInfo.code,
          });
          // }
        });
    } else if (req.body.photoURL == "") {
      const uid = req.body.id;
      admin
        .auth()
        .updateUser(uid, {
          displayName: req.body.displayName,
          phoneNumber: req.body.phoneNumber || "",
          email: req.body.email,
        })
        .then((data) => {
          return res.status(201).send({
            msg: "Profile Updated SuccessFully",
            data: data,
          });
        })
        .catch((error) => {
          return res.status(400).send({
            msg: error.errorInfo.code,
          });
        });
    }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
// try {
//   if (req.file) {
//     const uid = req.params.id;
//     const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
//     const fileName = name + path.extname(req.file.originalname);
//     await webApp.locals.bucket
//       .file(fileName)
//       .createWriteStream()
//       .end(req.file.buffer);
//     const file = `https://firebasestorage.googleapis.com/v0/b/ipodekho-19fc1.appspot.com/o/${fileName}?alt=media&token=11c648b5-a554-401c-bc4e-ba9155f29744`;
//     // Update the user's profile information
//     admin
//       .auth()
//       .updateUser(uid, {
//         displayName: req.body.displayName,
//         photoURL: file,
//         phoneNumber: req.body.phoneNumber,
//       })
//       .then((data) => {
//         return res.status(201).send({
//           msg: "Updated SuccessFully",
//           data: data,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(300).send({ msg: "PhoneNumber Already Exist" });
//       });
//   } else if (req.file == null) {
//     const uid = req.params.id;
//     admin
//       .auth()
//       .updateUser(uid, {
//         displayName: req.body.displayName,
//         phoneNumber: req.body.phoneNumber,
//         photoURL: null,
//       })
//       .then((data) => {
//         return res.status(201).send({
//           msg: "Updated SuccessFully",
//           data: data,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(300).send({ msg: "PhoneNumber Already Exist" });
//       });
//   }
// } catch (error) {
//   res.status(400).send({ msg: "User Not Found" });
// }
/**
 * The following Api contains source code for a Get Single User.
 */
const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    admin
      .auth()
      .getUser(id)
      .then((user) => {
        const photoURL = user.photoURL;
        const displayName = user.displayName;
        const phoneNumber = user.phoneNumber;
        const email = user.providerData[0].email;
        const GetSingleProfile = {
          photoURL: photoURL,
          displayName: displayName,
          phoneNumber: phoneNumber,
          email: email,
          uid: id,
        };
        return res.status(201).send({
          msg: "Get Single User SuccessFully",
          data: GetSingleProfile,
        });
      })
      .catch((error) => {
        return res.status(301).send({
          error,
        });
      });
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};
/**
 * The following Api contains source code for a Get All User.
 */
const getAllUser = async (req, res) => {
  try {
    const allUsers = [];
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach((user) => {
      allUsers.push(user);
    });

    // Sort the users by creation time in descending order
    allUsers.sort((a, b) => {
      const aTime = Date.parse(a.metadata.creationTime);
      const bTime = Date.parse(b.metadata.creationTime);
      return bTime - aTime;
    });

    res.status(201).send({
      msg: "Get All User Successfully",
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }).end();
  }
};
module.exports = {
  UpdateProfile,
  getAllUser,
  getSingleUser,
  getImage,
};
