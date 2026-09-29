// www.contentarc.app → contentarc.app (permanent), keeping the path and query.
export const onRequest: PagesFunction = ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname === "www.contentarc.app") {
    url.hostname = "contentarc.app";
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
