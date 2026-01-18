export const getSessionJoinUrl = (sessionId, location = window.location) => {
  if (!sessionId) return "";
  const url = new URL(location.href);
  url.hash = `#${sessionId}`;
  return url.toString();
};
