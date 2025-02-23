const express = require("express");


//Builder class to reduce redundancy across simmilar queries
const RouterBuilder = class {
    constructor (supabase, table, idField = null, defaultFields = "*", defaultSortField = null) {
        this.supabase = supabase;
        this.table = table;
        this.idField = idField;
        this.defaultFields = defaultFields;
        this.defaultSortField = defaultSortField;
        this.router = express.Router();
    }

    async handleQuery(res, query, ignoreSort = false) {
        if (this.defaultSortField && !ignoreSort){
            console.log(query);
            query = query.order(this.defaultSortField, { ascending: true }); 
        }
        const { data, error } = await query;
        if (error) return res.status(500).json({error: error.message});
        res.json(data); 
    }

    addGetAll() {
        this.router.get("/", async (req, res) => {
            await this.handleQuery(res, 
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
            );
        });
        return this; 
    }

    addGetById() {
        this.router.get("/:id", async (req, res) => {
            await this.handleQuery(res, 
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
                    .eq(this.idField, req.params.id)
                    .single()
            );
        });
        return this; 
    }

    //Adds route to search by field
    addSearchByField(routePath, fieldName) {
        this.router.get(routePath, async (req, res) => {
            await this.handleQuery(res, 
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
                    .ilike(fieldName, `${req.params.substring}%`)
            );
        });
        return this;
    }
    //Adds a sort route that sorts on a field diretly from path param 
    addGetAllSorted() {
        this.router.get("/sort/:field", async (req, res) => {
            const sortField = req.params.field;
            await this.handleQuery(res, 
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
                    .order(sortField, { ascending: true }),
                ignoreSort = true
            );
        });
        return this;
    }
    //Adds a sort route that sorts on mapped fields
    addGetAllSortedMapped(fieldMappings) {
        this.router.get("sort/:field", async (req, res) => {
            
            let userField = req.params.field
            let sortField = fieldMappings[userField]

            if(!sortField) {
                res.status(400).json({
                    error: `Invalid sort field, valid fields are: ${Object.keys(fieldMappings).join(", ")}`
                })
            }
            // Query sorted by the valid field
            await this.handleQuery(res, 
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
                    .order(sortField, { ascending: true }), 
                ignoreSort = true) 
        })
        return this
    }

    addSearchOnJoin(path, foreignKey) {
        this.router.get(path, async (req, res) => {
            const id = req.params.id;

            if (!id) return res.status(400).json({error: "ID is required"})
            
            await this.handleQuery(res,
                this.supabase
                    .from(this.table)
                    .select(this.defaultFields)
                    .eq(foreignKey, id)
            )
        })
        return this
    }

    //Adds a custom query
    addCustomQuery(path, queryFunction) {
        this.router.get(path, async (req, res) => {
            const query = queryFunction(this.supabase, req);
            await this.handleQuery(res, query, true);
        });
        return this;
    }
    
    addCustomRoute () {
    
    }
    build() {
        return this.router;
    }
}


module.exports = { RouterBuilder };
