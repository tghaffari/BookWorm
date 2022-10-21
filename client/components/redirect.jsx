export default function Redirect(props) {
  const url = new URL(window.location);
  url.hash = props.to;
  window.location.replace(url);
  return null;
}
