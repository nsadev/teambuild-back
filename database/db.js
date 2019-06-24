const users = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER_USERS,
        password: process.env.PGPASSWORD_USERS,
        database: process.env.PGDATABASE_USERS
    }
})

const contributions = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER_CONTR,
        password: process.env.PGPASSWORD_CONTR,
        database: process.env.PGDATABASE_CONTR
    }
})

const pictures = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER_IMG,
        password: process.env.PGPASSWORD_IMG,
        database: process.env.PGDATABASE_IMG
    }
})

module.exports = {
    users: users,
    contributions: contributions,
    pictures: pictures
}
