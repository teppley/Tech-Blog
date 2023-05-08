// Get references to HTML elements with specific IDs
var existingBlogs = document.querySelector("#existingblogs");
var createNew = document.querySelector("#createNew");
var newPost = document.querySelector("#newpost");
var newBlog = document.querySelector("#newBlog");

// Define a function to hide the "createNew" element
function hideCreateNew() {
  createNew.hidden = true;
}

// Hide the "createNew" element on page load
hideCreateNew();

// Listen for a "submit" event on the "newPost" form
newPost.addEventListener("submit", event => {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Hide the "existingBlogs" and "newPost" elements
  existingBlogs.hidden = true;
  newPost.hidden = true;

  // Show the "createNew" element
  createNew.hidden = false;
});

// Listen for a "submit" event on the "newBlog" form
newBlog.addEventListener("submit", event => {
  // Get the input values for "title" and "content"
  var title = document.querySelector("#title").value;
  var content = document.querySelector("#content").value;

  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Check that both "title" and "content" have been entered
  if (!title || !content) {
    alert("Please enter both title and content");
    return;
  }

  // Create an object with the blog title and content
  const blogObj = {
    title: title,
    content: content,
  };

  // Send a POST request to the "/api/blogs" endpoint with the blog object in the request body
  fetch("/api/blogs", {
    method: "POST",
    body: JSON.stringify(blogObj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => {
    // If the response from the server is successful, hide the "createNew" element and reload the page
    if (res.ok) {
      createNew.setAttribute("hidden", "false");
      location.reload();
    } 
    // If the response is not successful, display an error message to the user
    else {
      alert("Error - please try again");
    }
  });
});
