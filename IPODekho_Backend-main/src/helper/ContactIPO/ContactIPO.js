const { firestore } = require("../../config/firestoreCloud");
const Contact = firestore.collection("Contact Us");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("FGYOEUJ8DR", "ad1139d39fa664e5969253e8f33b698f");
const indexContact = client.initIndex("IPOContact");
/**
 * The following Api contains source code for a Get All Contact Data.
 */
const getAllContact = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    let page = req.query.page || 1;
    const search = req.body.search;
    if (req.body.search) {
      const GetContact = await Contact.select(
        "email",
        "firstName",
        "lastName",
        "message",
        "phone",
        "subject",
        "createdAt"
      );
      if (GetContact) {
        GetContact.offset(Number(page - 1) * limit)
          .limit(Number(limit))
          .orderBy("createdAt", "desc")
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.size === 0) {
              // No more documents left
              res.status(200).send({ msg: "No more documents left" });
              return;
            }
            const AllContact = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            Contact.get().then((querySnapshot) => {
              // let Total = querySnapshot.size;
              // const Merged = { AllContact, Total };
              indexContact
                .search(search, { hitsPerPage: 10, attributesToHighlight: [] })
                .then(({ hits }) => {
                  // const hits = MainLineIpo;
                  const AllContact = { AllContact: hits };
                  res.status(200).send({
                    msg: "All Contact Us Get Successfully",
                    data: AllContact,
                  });
                });
            });
          });
      } else {
        res.status(200).send({ msg: "! Not Get Contact" });
      }
    } else {
      const GetContact = await Contact.select(
        "email",
        "firstName",
        "lastName",
        "message",
        "phone",
        "subject",
        "createdAt"
      );
      if (GetContact) {
        GetContact.offset(Number(page - 1) * limit)
          .limit(Number(limit))
          .orderBy("createdAt", "desc")
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.size === 0) {
              // No more documents left
              res.status(200).send({ msg: "No more documents left" });
              return;
            }
            const AllContact = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            Contact.get().then((querySnapshot) => {
              let Total = querySnapshot.size;
              const AllContact1 = { AllContact, Total };
              res.status(200).send({
                msg: "All Contact Us Get Successfully",
                data: AllContact1,
              });
            });
          });
      } else {
        res.status(200).send({ msg: "! Not Get Contact" });
      }
    }
    // }
  } catch (error) {
    res.status(400).send({ msg: "User Not Found" });
  }
};

module.exports = {
  getAllContact,
};
