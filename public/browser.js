function itemTemplate(item) {     // Thie item param is being passed from axios callback function
  console.log("&&&&*****************")
  console.log(item)
    
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`
  }
  
// Initial Page load render 
let ourHtml = items.map(function(item){     // items is passed over from server.js in JSON.stringify in script tag 
    return itemTemplate(item)
  }).join('')                      // map returns array, join() joins array elements separated by commas, join('') means joined by nothing.
document.getElementById('item-list').insertAdjacentHTML("beforeend", ourHtml)


  // Create Feature
  let createField = document.getElementById("create-field")
  
  document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then(function (response) { // axios recieves responses from server "/create-item"
      // Create the HTML for a new item
      document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
      createField.value = ""
      createField.focus()
    }).catch(function() {
      console.log("Please try again later.")
    })
  })




document.addEventListener("click", function(e){

    // Delete

    if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you really want to delete this item permanently?")) {
          axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
            e.target.parentElement.parentElement.remove()
          }).catch(function() {
            console.log("Please try again later.")
          })
        }
      }

    // Update

    if ( e.target.classList.contains("edit-me")){
        console.log("^********************************************")
        let userInput = prompt("Enter New Text")
        console.log("uI" + userInput)

        let id = e.target.getAttribute("data-id")
        console.log(id)
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        }).catch(function(err){
            console.log(err)
        })
    }
})