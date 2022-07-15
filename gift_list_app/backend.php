<?php

require_once "db_connect.php";

if (isset($_POST['action'])) {
	$action = $_POST['action'];

	switch ($action) {
		case "searchRecipients":
			searchRecipients($connection);
			break;
		case "addRecipient":
			addRecipient($connection);
			break;
		case "displayRecipients":
			displayRecipients($connection);
			break;
		case "showOptions":
			showOptions($connection);
			break;
		case "editRecipient":
			editRecipient($connection);
			break;
		case "deleteRecipient":
			deleteRecipient($connection);
			break;
		default:
	}
}

// SEARCH FOR RECIPIENTS

function searchRecipients($connection) {
	if (isset($_POST)) {
		$search = $_POST['recipient'];

		if (!empty($search)) {
			$query = "SELECT * FROM gift_list where recipient LIKE '$search%'";
			$search_query = mysqli_query($connection, $query);
			$records = mysqli_num_rows($search_query);

			if (!$search_query) {
				die('QUERY FAILED. Error: ' . mysqli_error($connection));
			}

			while ($row = mysqli_fetch_array($search_query)) {
				$recipient = $row['recipient'];
				$gift = $row['gift'];

				echo "<p class='results'>{$recipient} = {$gift}</p>";
			}
		}
	}
}

// ADD RECIPIENT & GIFT TO DATABASE

function addRecipient($connection) {
	if (isset($_POST['recipient']) && isset($_POST['gift'])) {
		$recipient = $_POST['recipient'];
		$gift = $_POST['gift'];

		if (!empty($recipient) && !empty($gift)) {
			$query = "INSERT INTO gift_list (recipient, gift) VALUES ('$recipient', '$gift')";
			$add_recipient_query = mysqli_query($connection, $query);

			if (!$add_recipient_query) {
				die('QUERY FAILED: ' . mysqli_error($connection));
			} else {
				echo "<p class='results' id='successmsg'>${recipient} was added!</p><p id='closeit' class='results'>X</p>";
			}
		}
	}
}

// DISPLAY RECIPIENTS & GIFTS

function displayRecipients($connection) {
	$query = "SELECT * FROM gift_list";
	$display_query = mysqli_query($connection, $query);

	if (!$display_query) {
		die("QUERY FAILED. Error: " . mysqli_error($connection));
	}

	while ($row = mysqli_fetch_array($display_query)) {
		echo "<tr>";
		echo "<td><a href='javascript:void(0)' rel='".$row['id']."' class='idLink'>{$row['id']}</a></td>";
		echo "<td class='recipient-row'>{$row['recipient']}</td>";
		echo "<td class='gift-row'>{$row['gift']}</td>";
		echo "</tr>";
	}
}

// DISPLAY OPTIONS MODAL TO EDIT/DELETE DATA

function showOptions($connection) {
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$query = "SELECT * FROM gift_list WHERE id = $id";
		$query_info = mysqli_query($connection, $query);

		if (!$query_info) {
			die("QUERY FAILED. Error: " . mysqli_error($connection));
		}

		while ($row = mysqli_fetch_array($query_info)) {
			echo "<input type='text' id='recipient-input' value='' placeholder='".$row['recipient']."'>";
			echo "<input type='text' id='gift-input' value='' placeholder='".$row['gift']."'>";
			echo "<input type='button' id='editbtn' value='Update'>";
			echo "<input type='button' id='deletebtn' value='Delete'>";
			echo "<input type='button' id='closebtn' value = 'X'>";
		}
	}
}

// EDIT RECIPIENT AND/OR GIFT

function editRecipient($connection) {
	if (isset($_POST['newGift']) && !isset($_POST['newRecipient'])) {
		$id = $_POST['id'];
		$newGift = $_POST['newGift'];
		$query = "UPDATE gift_list SET gift = '$newGift' WHERE id = $id";
		$query_info = mysqli_query($connection, $query);

		if(!$query_info) {
			die("QUERY FAILED. Error: " . mysqli_error($connection));
		}
	}

	if (isset($_POST['newRecipient']) && !isset($_POST['newGift'])) {
		$id = $_POST['id'];
		$newRecipient = $_POST['newRecipient'];
		$query = "UPDATE gift_list SET recipient = '$newRecipient' WHERE id = $id";
		$query_info = mysqli_query($connection, $query);

		if(!$query_info) {
			die("QUERY FAILED. Error: " . mysqli_error($connection));
		}
	}

	if (isset($_POST['newRecipient']) && isset($_POST['newGift'])) {
		$id = $_POST['id'];
		$newRecipient = $_POST['newRecipient'];
		$newGift = $_POST['newGift'];
		$query = "UPDATE gift_list SET recipient = '$newRecipient', gift = '$newGift' WHERE id = $id";
		$query_info = mysqli_query($connection, $query);

		if(!$query_info) {
			die("QUERY FAILED. Error: " . mysqli_error($connection));
		}
	}
}

// DELETE RECIPIENT

function deleteRecipient($connection) {
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$query = "DELETE FROM gift_list WHERE id = $id";
		$query_info = mysqli_query($connection, $query);

		if (!$query_info) {
			die("QUERY FAILED. Error: " . mysqli_error($connection));
		}
	}
}

?>
