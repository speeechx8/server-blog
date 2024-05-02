import { Router } from "express";
const router = Router();
import { writeFile } from "fs";
import blog from "../api/blog.json" with { type: "json" };
import { dirname } from "path";

// display all blog posts on homepage
router.get("/", (request, response) => {
    console.log("displaying all posts");
    response.status(200);
    // response.send(blog);
    const rootDir = dirname(import.meta.dirname);
    response.sendFile("./views/index.html", { root: rootDir });
});

// display single post based on post_id
router.get("/:id", (request, response) => {
    console.log("get single post request recieved");
    const requestedPost = blog.find((post) => post.post_id === parseInt(request.params.id));
    // check if desired post exists
    if(requestedPost) {
        console.log("request successful");
        response.status(200);
        // response.send(requestedPost);
        const rootDir = dirname(import.meta.dirname);
        response.sendFile(`./views/index.html`, { root: rootDir });
    }
    else {
        console.log("request failed");
        response.status(404);
        response.send("Sorry, I can't seem to find that one.");
    }
});

// create new entry
router.post("/", (request, response) => {
    console.log("create new post request recieved");
    const newPost = request.body;

    // check if post_id is already included
    if(blog.some((post) => newPost.post_id === post.post_id)) {
        console.log("duplicate post_id recieved, cannot add to blog");
        response.status(400);
        response.send(`Sorry, there is already a post with an ID of ${newPost.post_id}`);
    }
    else { // add post to end of blog
        console.log("adding new post to blog");
        // get current last post_id number
        const newPostID = blog[blog.length - 1].post_id + 1;
        // check if post_id is already included in request.body
        if(Object.keys(request.body).includes("post_id")) {
            delete request.body.post_id;
        }
        // add post_id to body
        blog.push(Object.assign({ "post_id": newPostID}, newPost));
        // rewrite blog.json with new array
        writeFile("./api/blog.json", JSON.stringify(blog, null, 4), (err) => {
            if(err) {
                console.log("error has occured, file not written");
                response.status(404);
                response.send("Whoops, something went wrong! Please try again!");
            }
            else {
                console.log("success, file has been written");
                response.status(201);
                response.send(`Success! New post added under ID: ${newPost.post_id}`);
            }
        });
    }
});

// edit a post based on post_id
router.post("/:id", (request, response) => {
    console.log("edit post request recieved");
    const requestedPost = blog.findIndex((post) => post.post_id === parseInt(request.params.id));

    // check if desired post exists
    if(requestedPost >= 0) {
        console.log(`editting post #${request.params.id}`);
        // loop through keys on requested blog object
        Object.keys(blog[requestedPost]).forEach((key) => {
            // check if request.body contains matching keys
            if(Object.keys(request.body).includes(key)) {
                // check if trying to change post_id
                if(key === "post_id") {
                    console.log("cannot change post_id");
                    return;
                }
                else { // change key's value to new value
                    console.log(`${key} is being editted`);
                    blog[requestedPost][key] = request.body[key];
                }
            }
        });
        // rewrite blog.json with new array
        writeFile("./api/blog.json", JSON.stringify(blog, null, 4), (err) => {
            if(err) {
                console.log("error has occured, file not written");
                response.status(404);
                response.send("Whoops, something went wrong! Please try again!");
            }
            else {
                console.log("success, file has been written");
                response.status(201);
                response.send(`Editted post #${request.params.id} on our blog.`);
            }
        });
    }
    else {
        console.log("post to edit does not exist");
        response.status(400);
        response.send(`Sorry, there doesn't seem to be a post with an ID of ${request.params.id}. Did you mean to create a new post?`);
    }
});

// delete a post by post_id
router.delete("/:id", (request, response) => {
    console.log("delete request recieved");
    const requestedPost = blog.findIndex((post) => post.post_id === parseInt(request.params.id));

    // check if desired post exists
    if(requestedPost >= 0) {
        console.log("post is currently in list");
        blog.splice(requestedPost, 1);

        // rewrite blog.json with new array
        writeFile("./api/blog.json", JSON.stringify(blog, null, 4), (err) => {
            if(err) {
                console.log("error has occured, file not written");
                response.status(404);
                response.send("Whoops, something went wrong! Please try again!");
            }
            else {
                console.log("success, file has been written");
                response.status(200);
                response.send(`Deleted post #${request.params.id} from our blog.`);
            }
        });
    }
    else {
        console.log("post to delete does not exist");
        response.status(400);
        response.send(`Sorry, there doesn't seem to be a post with an ID of ${request.params.id}.`);
    }
});

export default router;