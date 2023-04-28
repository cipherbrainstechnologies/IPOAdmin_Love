import React from "react";
import CommonMultiplyIcon from "../assets/media/Icons/CommonMultiplyIcon";
import { useDispatch } from "react-redux";
import { deleteNewsApi } from "../redux/slice/newsSlice";

const NewsDeleteModal = ({ newsID, setShowModal, showModal }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    let payload = {
      id: newsID?.id,
      algoliaId: newsID?.algoliaID
    };
    dispatch(deleteNewsApi({ payload }));
    setShowModal({
      ...showModal,
      showClass: "",
      displayClass: "",
      modalBackdrop: "",
    });
  };

  return (
    <div className="modal-dialog modal-dialog-centered mw-650px">
      <div className="modal-content">
        <div className="modal-header" id="kt_modal_edit_user_header">
          <h2 className="fw-bold">Delete News</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            data-bs-dismiss="modal"
            onClick={() => {
              // setFileDataURL("");
              setShowModal({
                ...showModal,
                showClass: "",
                displayClass: "",
                modalBackdrop: "",
              });
            }}
          >
            <CommonMultiplyIcon />
          </div>
        </div>

        <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <h2>Are you sure you went to delete News ?</h2>
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <button
            onClick={() => {
              setShowModal({
                ...showModal,
                showClass: "",
                displayClass: "",
                modalBackdrop: "",
              });
            }}
            type="reset"
            className="btn btn-light me-3"
            data-bs-dismiss="modal"
            style={{
              marginRight: "20px",
              marginBottom: "10px",
            }}
          >
            Discard
          </button>
          <button
            className="btn btn-danger"
            style={{
              marginRight: "20px",
              marginBottom: "10px",
            }}
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDeleteModal;
