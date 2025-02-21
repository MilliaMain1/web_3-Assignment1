const express = require("express");
const {RouterBuilder} = require("../routerHelper.js");

module.exports = (supabase) => {
    return new RouterBuilder(supabase, "eras")
        .addGetAll()
        .build()
};
