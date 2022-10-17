export default function handleFetchRejection(err) {
  console.error(err);
  window.alert('We are unable to process your request at this time. Please check your internet connection and try again later.');
}
