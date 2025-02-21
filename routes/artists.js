const { RouterBuilder } = require("../routerHelper")



module.exports = (supabase) => {
    return new RouterBuilder(supabase, "artists", "artistId")
        .addGetAll()
        .addGetById()
        .addSearchByField("lastName", "/search/:substring")
        .addSearchByField("nationality", "/country/:substring")
        .build()
}
