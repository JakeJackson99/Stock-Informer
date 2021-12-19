var hrefConverter = function(req, res, next) {
    if (req.query._method == "DELETE") {
        req.method = "DELETE";
        req.url = req.path;
    }

    // else if (req.query._method = "POST") {
    //     req.method = "POST";
    //     req.url = req.path;
    // }

    next();
}

module.exports = hrefConverter;