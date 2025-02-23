const { RouterBuilder } = require("../routerHelper")



module.exports = (supabase) => {
    return new RouterBuilder(supabase, "artists", "artistId")
        .addGetAll()
        .addGetById()
        .addSearchByField("/search/:substring", "lastName")
        .addSearchByField("/country/:substring", "nationality")
        .build()
}
