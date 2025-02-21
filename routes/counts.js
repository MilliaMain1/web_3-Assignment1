const { RouterBuilder } = require("../routerHelper");


module.exports = (supabase) => {
    return new RouterBuilder(supabase, "counts")
        .addCustomQuery("/genres", 
            (supabase, req) => {
                return supabase
                    .from("genre_count_view")
                    .select("*")
            }
        )
        .addCustomQuery("/artists", 
            (supabase, req) => {
                return supabase
                    .from("artist_count_view")
                    .select("*")
            }
        )
        .addCustomQuery("/topgenres/:min?", 
            (supabase, req) => {
                const minimum = req.params.min || 20
                return supabase
                    .from("genre_count_view")
                    .select("*")
                    .gt("count", minimum)
            }
        )
        .build()
};
