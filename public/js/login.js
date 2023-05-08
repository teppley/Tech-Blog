// Listen for a "submit" event on the login form
document.querySelector("#login").addEventListener("submit", event => {
    // Prevent the default behavior of submitting the form and refreshing the page
    event.preventDefault();
  
    // Create a new object with the username and password from the form
    const userObj = {
      username: document.querySelector("#loginUsername").value,
      password: document.querySelector("#loginPassword").value,
    };
    
    // Log the user object to the console for debugging
    console.log(userObj);
  
    // Send a POST request to the server with the user object as the request body
    fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    })
    // Handle the response from the server
    .then(res => {
      // If the response is successful (status code between 200 and 299)
      if (res.ok) {
        // Log a message to the console indicating that the user is logged in
        console.log("user is logged in");
        // Redirect the user to the dashboard page
        location.href = "/dashboard";
      } 
      // If the response is not successful
      else {
        // Display an alert to the user indicating that they should try again
        alert("please try again");
      }
    });
  });
  