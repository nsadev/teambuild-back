const express = require("express")
const projects = require("../database/db").contributions

const { checkToken } = require("../middleware/checkToken")

const router = new express.Router()

// Sending all projects from DB
router.get("/", (req, res) => {
    try {
        projects
            .select("*")
            .from("project")
            .then(prj => {
                res.json(prj)
            })
    } catch (e) {
        res.status(500).send({ message: "Server is not available" })
    }
})

// New Project API

router.post("/new", checkToken, (req, res) => {
    const { title, leader, tech, contributors, description, github } = req.body

    // Check if required datas are present
    if (!title || !leader || !tech || !contributors) {
        return res.status(400).send({
            message: "Name, tech stack or number of contributors are missing.",
        })
    }

    // Insert project into database
    try {
        projects
            .select("name")
            .from("project")
            .where({ name: title })
            .then(data => {
                if (data.length !== 0) {
                    return res
                        .status(400)
                        .send({ message: "Project name already exist" })
                } else {
                    try {
                        projects.transaction(trx => {
                            return trx
                                .insert({
                                    name: title,
                                    description: description,
                                    project_leader: leader,
                                    tech_stack: tech,
                                    contributors_num: contributors,
                                    github: github,
                                    created: new Date(),
                                })
                                .into("project")
                        })
                        res.json({
                            message: "New Project created",
                        })
                    } catch (e) {
                        res.status(500).send({ message: "Database error" })
                    }
                }
            })
    } catch (e) {
        res.status(500).send({ message: "Server is not available" })
    }
})

module.exports = router
