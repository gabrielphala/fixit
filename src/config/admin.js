const Admin = require("../models/Admin");

const Hasher = require("../helpers/Hasher");

(async () => {
    if ((await Admin.exists({ email: 'admin@fixit.com' })).found)
        return;

    Admin.insert({
        firstname: "George",
        lastname: "Timber",
        email: "admin@fixit.com",
        password: await Hasher.hash("Password123")
    })
})();