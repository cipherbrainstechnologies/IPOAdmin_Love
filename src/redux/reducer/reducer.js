import { combineReducers } from "redux";
import chatSlice from "../slice/chatSlice";
import imagePreviewSlice from "../slice/imagePreviewSlice";
import mainLineIpoSlices from "../slice/mainLineIpoSlices";
import newsSlice from "../slice/newsSlice";
import offersSlice from "../slice/offersSlice";
import sidebarToggleSlice from "../slice/sidebarToggleSlice";
import privacyPolicySlice from "../slice/privacyPolicySlice";
import faqsSlice from "../slice/faqsSlice";
import ipoAllotSlice from "../slice/ipoAllotSlice";
import termsAndConditionsSlice from "../slice/termsAndConditionsSlice";
import contactUsSlice from "../slice/contactUsSlice";
import usersSlice from "../slice/usersSlice";
import modalSlice from "../slice/modalSlice";
import notificationsSlice from "../slice/notificationsSlice";
import paginationSlice from "../slice/paginationSlice";
const reducer = combineReducers({
  //slice
  mainLineIpoSlice: mainLineIpoSlices,
  toggleReducer: sidebarToggleSlice,
  chatReducer: chatSlice,
  newsReducer: newsSlice,
  imagePreviewReducer: imagePreviewSlice,
  offersReducer: offersSlice,
  privacyPolicyReducer: privacyPolicySlice,
  faqsReducer: faqsSlice,
  ipoAllotReducer: ipoAllotSlice,
  termsConditionsReducer: termsAndConditionsSlice,
  contactUsReducer: contactUsSlice,
  userReducer: usersSlice,
  modalReducer: modalSlice,
  notificationReducer: notificationsSlice,
  paginationReducer: paginationSlice,
});
export default reducer;
