const blogPath = "../api/blog.json";
const display = document.getElementById("display");
const path = window.location.pathname;

async function displayBlogPosts() {
    let blog = await getBlog(blogPath);
    display.innerHTML = "";
    
    if(path === "/") {
        for(let post in blog) {
            // create html elements
            let postContainter = document.createElement("div");
            let titleElement = document.createElement("h2");
            let authorElement = document.createElement("h3");
            let bodyElement = document.createElement("div");
    
            // assign post components to html elements
            titleElement.textContent = blog[post].title;
            authorElement.textContent = blog[post].author;
            bodyElement.textContent = blog[post].body;
    
    
            // add new elements to display
            postContainter.appendChild(titleElement);
            postContainter.appendChild(authorElement);
            postContainter.appendChild(bodyElement);
            display.appendChild(postContainter);
        }
    }
    else {
        const requestedPost = blog.findIndex((post) => post.post_id === parseInt(path.substring(1)));
        
        // create html elements
        let postContainter = document.createElement("div");
        let titleElement = document.createElement("h2");
        let authorElement = document.createElement("h3");
        let bodyElement = document.createElement("div");

        // assign post components to html elements
        titleElement.textContent = blog[requestedPost].title;
        authorElement.textContent = blog[requestedPost].author;
        bodyElement.textContent = blog[requestedPost].body;

        // add new elements to display
        postContainter.appendChild(titleElement);
        postContainter.appendChild(authorElement);
        postContainter.appendChild(bodyElement);
        display.appendChild(postContainter);
    }
}

async function getBlog(path) {
    try {
        const res = await fetch(path);
        const blogData = await res.json();
    
        return blogData;
    }
    catch(err) {
        console.log(err);
    }
}

await displayBlogPosts();