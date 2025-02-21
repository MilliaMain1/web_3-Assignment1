const { RouterBuilder } = require("../routerHelper")
const defaultFields = "paintingId, title, yearOfWork, imageFileName, gallery:galleryId(*), artist:artistId(*)" 

module.exports = (supabase) => {
    return new RouterBuilder(supabase, "paintings", "paintingId", defaultFields, "title")
    .addGetAll()
    .addGetById()
    .addGetAllSortedMapped({
        title: "title",
        year: "yearOfWork"
    })
    .addCustomQuery("/years/:start/:end", (supabase, req) => 
            supabase
                .from("paintings")
                .select("paintingId, title, yearOfWork")
                .gte("yearOfWork", req.params.start)
                .lte("yearOfWork", req.params.end)
    )
    .addSearchOnJoin("/galleries/:id", "galleryId")
    .addSearchOnJoin("/artist/:id", "artistId")
    
    .addCustomQuery("/artists/country/:substring", 
            (supabase, req) => {
                return supabase
                    .from("paintings")
                    .select(defaultFields)
                    .ilike("artist.nationality", `${req.params.substring}`)
                    .order("title", {ascending: true})
    })
    .addCustomQuery("/genre/:genreId", (supabase, req) => {
        const genreId = req.params.genreId;
            return supabase
                .from("paintingGenres")
                .select(
                    "paintings(paintingId, title, yearOfWork), genres!inner()"
                )
                .eq("genres.eraId", genreId)
                .order("paintings(yearOfWork)", { ascending: true })
                .then((result) => {
                    if(result.error) return result;
                    result.data = result.data.map((row) => row.paintings)
                    return result;
                })

    })
    .addCustomQuery("/era/:eraId", (supabase, req) => {
        const eraId = req.params.eraId;
            return supabase
                .from("paintingGenres")
                .select(
                    "paintings(paintingId, title, yearOfWork), genres!inner()"
                )
                .eq("genres.eraId", eraId)
                .order("paintings(yearOfWork)", { ascending: true })
                .then((result) => {
                    if(result.error) return result;
                    result.data = result.data.map((row) => row.paintings)
                    return result;
                })
    })
    .build()

}
