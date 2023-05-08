document.querySelector("#update").addEventListener("click",event=>{
    // prevent the default behavior of the event (submitting the form)
    event.preventDefault();
    // get the ID of the blog to be updated
    const blogId = document.querySelector("#hiddenBlogId").value; 
    const editBlog = {
        // get the updated title of the blog
        title:document.querySelector("#editedTitle").value,
        // get the updated content of the blog
        content:document.querySelector("#editedContent").value,
    }
    console.log(blogId);
    console.log(editBlog);
    // send a PUT request to the server to update the blog with the specified ID
    fetch((`/api/blogs/${blogId}`),{ 
        method:"PUT",
        // convert the updated blog object to JSON format and send it in the request body
        body:JSON.stringify(editBlog),
        headers:{
            // set the content type of the request body to JSON
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
            console.log("blog updated")
            // reload the dashboard page if the blog was successfully updated
            location.href="/dashboard"
        } else {
            alert("please try again")
        }
    })
  })
  
  document.querySelector("#delete").addEventListener("click",event=>{
    // prevent the default behavior of the event (submitting the form)
    event.preventDefault();
    // get the ID of the blog to be deleted
    const blogId = document.querySelector("#hiddenBlogId").value;
    // send a DELETE request to the server to delete the blog with the specified ID   
    fetch((`/api/blogs/${blogId}`),{
        method:"DELETE",
    }).then(res=>{
        if(res.ok){
            console.log("blog deleted")
            // reload the dashboard page if the blog was successfully deleted
            location.href="/dashboard"
        } else {
            alert("please try again")
        }
    })
  })
  