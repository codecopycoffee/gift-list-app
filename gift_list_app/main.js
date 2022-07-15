// SEARCH CODE
var searchBox = document.getElementById("search");

conductSearch = () => {
	var searchEntry = searchBox.value;
	var searchRequest = new XMLHttpRequest();

	searchRequest.open("POST", "backend.php", true);
	searchRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	searchRequest.send("action=searchRecipients&recipient=" + searchEntry);
	searchRequest.onreadystatechange = function() {
		if (searchRequest.readyState == 4 && searchRequest.status == 200) {
			document.getElementById("search-result").innerHTML = searchRequest.responseText;
		}
	}
}

searchBox.onkeyup = conductSearch;

// ADD RECIPIENT CODE
var addRecipientForm = document.getElementById("add-recipient-form");

addRecipientForm.addEventListener("submit", function(e) {
	e.preventDefault();
	var addRequest = new XMLHttpRequest();
	var formData = new FormData(this);
	var arr = [];
	var formArr = [];

	for (const [key, value] of formData) {
		arr.push(key + "=" + value);
	}

	for (i=0; i<arr.length; i++) {
		if (i != arr.length-1) {
			formArr.push(arr[i] + "&");
		} else {
			formArr.push(arr[i]);
		}
	}

	addRequest.open("POST", addRecipientForm.getAttribute("action"), true);
	addRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	addRequest.send("action=addRecipient&" + formArr.join(''));
	addRequest.onreadystatechange = function() {
		if (addRequest.readyState == 4 && addRequest.status == 200) {
			document.getElementById("recipient-result").innerHTML = addRequest.responseText;
			var closeit = document.getElementById("closeit");
			var successmsg = document.getElementById("successmsg");
			closeit.addEventListener("click", function() {
				closeit.style.display = "none";
				successmsg.style.display = "none";
			})
			displayRecipients();
		}
	}
	addRecipientForm.reset();
})

// DISPLAY RECIPIENTS & GIFTS CODE
displayRecipients = () => {
	var displayRequest = new XMLHttpRequest();

	displayRequest.open("POST", "backend.php", true);
	displayRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	displayRequest.send("action=displayRecipients");
	displayRequest.onreadystatechange = function() {
		if (displayRequest.readyState == 4 && displayRequest.status == 200) {
			document.getElementById("show-gifts").innerHTML = displayRequest.responseText;

			// OPTION BOX CODE
			var optionContainer = document.getElementById("option-container");
			var idLinks = document.getElementsByClassName("idLink");
			optionContainer.style.visibility = "hidden";

			// FUNCTIONALITY WHEN CLICKING ID LINKS
			for (i=0; i<idLinks.length; i++) {
				let currentId = idLinks[i];
				currentId.addEventListener("click", function(e) {
					e.preventDefault();
					optionContainer.style.visibility = "visible";
					var id = this.getAttribute("rel");
					var optionRequest = new XMLHttpRequest();

					optionRequest.open("POST", "backend.php", true);
					optionRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					optionRequest.send("id=" + id + "&action=showOptions");
					optionRequest.onreadystatechange = function() {
						if (optionRequest.readyState == 4 && optionRequest.status == 200) {
							optionContainer.innerHTML = optionRequest.responseText;

							// HIDE ACTION BOX FUNCTIONALITY
							var closebtn = document.getElementById("closebtn");
							closebtn.addEventListener("click", function(e) {
								e.preventDefault();
								optionContainer.style.visibility = "hidden";
							})

							// EDIT FUNCTIONALITY
							var editbtn = document.getElementById("editbtn");

							editbtn.addEventListener("click", function(e) {
								e.preventDefault();
								var newRecipient = document.getElementById("recipient-input").value;
								var newGift = document.getElementById("gift-input").value;
								var editRequest = new XMLHttpRequest();

								editRequest.open("POST", "backend.php", true);
								editRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								if ((newRecipient == '') && (newGift === '')) {
									alert("Unable to update: no change to recipient or gift.");
								} else if ((newRecipient === '') && (newGift != '')) {
									editRequest.send("id=" + id + "&action=editRecipient&newGift=" + newGift);
								} else if ((newRecipient != '') && (newGift === '')) {
									editRequest.send("id=" + id + "&action=editRecipient&newRecipient=" + newRecipient);
								} else if ((newRecipient != '') && (newGift != '')) {
									editRequest.send("id=" + id + "&action=editRecipient&newRecipient=" + newRecipient + "&newGift=" + newGift);
								}

								editRequest.onreadystatechange = function() {
								 if (editRequest.readyState == 4 && editRequest.status == 200) {
								 	displayRecipients();
									}
							 	}
							})

							// DELETE FUNCTIONALITY
							var deletebtn = document.getElementById("deletebtn");

							deletebtn.addEventListener("click", function(e) {
								e.preventDefault();

								var deleteRequest = new XMLHttpRequest;
								deleteRequest.open("POST", "backend.php", true);
								deleteRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								deleteRequest.send("id=" + id + "&action=deleteRecipient");
								deleteRequest.onreadystatechange = function() {
									if (deleteRequest.readyState == 4 && deleteRequest.status == 200) {
										displayRecipients();
									}
								}
							})
						}
					}
				})
			}
		}
	}
}

displayRecipients();
