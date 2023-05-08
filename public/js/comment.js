// Listen for a submit event on the form with ID "newComment"
document.querySelector("#newComment").addEventListener("submit", event => {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
  
    // Create an object with the comment's body and associated blog ID
    const comment = {
      body: document.querySelector("#comment").value,
      blogId: document.querySelector("#hiddenCommentId").value,
    };
  
    // Send a POST request to the "/api/comments" endpoint with the comment object as the request body
    fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      // If the response from the server is successful, log a message and reload the page
      if (res.ok) {
        console.log("comment posted");
        location.reload();
      } 
      // If the response is not successful, display an error message to the user
      else {
        alert("please try again");
      }
    });
  });
  