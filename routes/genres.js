const {RouterBuilder} = require("../routerHelper.js");
const defaultFields = "genreId, genreName, description, wikiLink, era:eraId(*)";
module.exports = (supabase) => {
    return new RouterBuilder(supabase, "genres", "genreId", defaultFields)
        .addGetAll()
        .addGetById()
        .addCustomQuery("/painting/:id", 
            (supabase, req) => {
                const id = req.params.id;
                return supabase
                    .from("paintingGenres")
                    .select(
                        "paintings!inner(), genres(*)"
                    )
                    .eq("paintings.paintingId", id)
                    //.order("genres(genreName)", { ascending: true })
                    .then((result) => {
                        if(result.error) return result;
                        result.data = result.data.map((row) => row.genres)
                       return result;
                    })
            }) 
        .build()
        
};
