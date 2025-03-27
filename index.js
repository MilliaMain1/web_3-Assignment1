const express = require("express");
const cors = require("cors");

const { createClient } = require("@supabase/supabase-js");
const erasRouter = require("./routes/eras.js");
const galleriesRouter = require("./routes/galleries.js");
const artistsRouter = require("./routes/artists.js");
const paintingsRouter = require("./routes/paintings.js");
const genresRouter = require("./routes/genres.js")
const countsRouter = require("./routes/counts.js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const SUPABASE_URL =  process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
console.log(SUPABASE_URL)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(express.json());

app.use("/api/eras", erasRouter(supabase));
app.use("/api/galleries", galleriesRouter(supabase));
app.use("/api/artists", artistsRouter(supabase));
app.use("/api/paintings", paintingsRouter(supabase));
app.use("/api/genres", genresRouter(supabase));
app.use("/api/counts", countsRouter(supabase));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
