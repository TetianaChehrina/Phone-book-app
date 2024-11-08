export function notFoundHandler(req, res) {
  res.status(404).json({
    message: "Oops, page not found",
  });
}
