export default function getTokenFromURL(url) {
  // Remove ?employee=true from the URL
  const urlWithoutQuery = url.replace(/\?employee=true$/, '');

  // Extract the token
  const token = urlWithoutQuery.match(/\/([^/]+)$/)[1];

  return token;
}
