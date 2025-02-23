const express = require("express");
const { RouterBuilder } = require("../routerHelper");


module.exports = (supabase) => {
    return new RouterBuilder(supabase, "galleries", "galleryId")
        .addGetAll()
        .addGetById()
        .addSearchByField("/country/:substring", "galleryCountry")
        .build()
};
