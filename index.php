<?php 

// "Things We Do" App by iamnotagoodartist
// http://iamnotagoodartist.com/web-design/things-we-do/

mysql_connect("localhost", "mysql_user", "mysql_password") or die(mysql_error());
mysql_select_db("thingswedo") or die(mysql_error());
mysql_select_db("thingswedotest") or die(mysql_error());

mysql_query("CREATE TABLE thingswedo ( id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), title MEDIUMTEXT, description MEDIUMTEXT, tags MEDIUMTEXT)") or die(mysql_error()); exit("Table made. Delete row 10 from index.php!");

$result = mysql_query("SELECT * FROM thingswedo ORDER BY title") or die(mysql_error());

session_start();

$alltags = array();
$alltagsstring = "";

if ($_GET["p"] == "logout") {
	session_destroy();
	header ("location:/");
}

if ($_POST["sessionid"] == session_id()) {
	if (isset($_POST["username"])) {
		if (($_POST["username"] == "username") && ($_POST["password"] == "password")) {
			$_SESSION["page"] = "loggedin";
		} else {
			$_SESSION["page"] = "loggedout";
			$message = "Invalid credentials.";
		}
	}
	if (isset($_POST["new"])) {
		mysql_query("INSERT INTO thingswedo (title, description, tags) VALUES('".htmlspecialchars($_POST["title"], ENT_QUOTES)."', '".htmlspecialchars($_POST["description"], ENT_QUOTES)."', '".htmlspecialchars($_POST["tags"], ENT_QUOTES)."') ") or die(mysql_error());
		header ("location: /");
		$result = mysql_query("SELECT * FROM thingswedo ORDER BY rand()") or die(mysql_error());
	}
	
	if (isset($_POST["edit"])) {
		mysql_query("UPDATE thingswedo SET title='".htmlspecialchars($_POST["title"], ENT_QUOTES)."', description='".htmlspecialchars($_POST["description"], ENT_QUOTES)."', tags='".htmlspecialchars($_POST["tags"], ENT_QUOTES)."' WHERE id='".$_POST["id"]."'") or die(mysql_error());
		header ("location: /");
		$result = mysql_query("SELECT * FROM thingswedo ORDER BY rand()") or die(mysql_error());
	}
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Things We Do</title>
<link href="style.css" type="text/css" rel="stylesheet" media="screen" />
</head>

<body>

<div class="container">
	<div class="header">
		<h1><a href="/">Things We Do</a></h1>
		<ul>
			<li><a href="#" id="a_new">New Thing</a></li>
			<li><a href="#" id="a_reset">Reset Opacity</a></li>
			<?php if ($_SESSION["page"] == "loggedin") { ?>
				<li><a href="/?p=logout">Log Out</a></li>
			<?php } ?>
		</ul>
	</div>
	<div class="content">
		<h2 class="hidden">A List of Things We Do</h2>
		<ul id="thingswedo">
		<?php while($row = mysql_fetch_array($result)){ 
		$tag = explode(" ",trim($row["tags"]));
		asort($tag);
		?> 
			<li class="<?php foreach ($tag as $value) { echo "li_$value "; } ?>">
				<strong><span class="span_title"><?php echo $row["title"]; ?></span></strong>
				<div class="details">
					<?php if ($row["description"] !== "") { ?><span class="span_description"><?php echo $row["description"]; ?></span><br /><?php } ?>
					<?php if ($row["tags"] !== "") { ?><label>Tags: </label><?php foreach ($tag as $value) { echo "<a href='#$value' class='tag'>$value</a> "; if (!(in_array($value, $alltags))) { $alltags[] = $value; $alltagsstring = $alltagsstring.",\"$value\""; } } ?><span class="span_tags hidden"><?php foreach ($tag as $value) { echo $value." "; } ?></span><?php } ?>
				</div>
				<a class="a_edit" rel="<?php echo $row["id"]; ?>" href="#">&sect;</a>
			</li>
		<?php } ?>
		</ul>
		<br class="clear" />
		<p id="p_tags"><strong>Tags:</strong> <?php $i = 0; asort($alltags); foreach ($alltags as $value) { echo "<a href='#$value' class='tag' rel='$i'>$value</a> "; $i++; } ?>
	</div>
	<div class="footer">
		<p><?php echo date("Y"); ?> <a href="/">Things We Do</a>. Designed and coded by <a href="http://iamnotagoodartist.com/">iamnotagoodartist</a>, with help from <a href="http://desandro.com/resources/jquery-masonry/">masonry</a>, <a href="http://james.padolsey.com/javascript/jquery-plugin-autoresize/">autoResize</a>, <a href="http://remysharp.com/2007/12/28/jquery-tag-suggestion/">tag suggestion</a>.</p>
	</div>
</div>

<div id="panel_new" class="panel">
	<?php if ($_SESSION["page"] !== "loggedin") { ?>
		<h2>Log In</h2>
		<form action="/" method="post">
			<?php if (isset($message)) { echo "<p class='p_message'>".$message."</p>"; } ?>
			<input type="hidden" name="sessionid" value="<?php echo session_id(); ?>" />
			<p>
				<label for="username">Username:</label>
				<input type="text" name="username" id="username" value="<?php echo $_POST["username"]; ?>" class="textinput" />
			</p>
			<p>
				<label for="password">Password:</label>
				<input type="password" name="password" id="password" value="<?php echo $_POST["password"]; ?>" class="textinput" />
			</p>
			<p>
				<label></label>
				<input type="submit" value="Start-Wow!" class="button" />
			</p>
		</form>
	<?php } else { ?>
		<h2>New Thing</h2>
		<form method="post" action="/">
			<input type="hidden" name="sessionid" value="<?php echo session_id(); ?>" />
			<p>
				<label for="form_title">Title:</label>
				<input type="text" class="textinput" name="title" id="form_title" value="" />
			</p>
			<p>
				<label for="form_description">Description:</label>
				<textarea class="textinput" name="description" id="form_description"></textarea>
			</p>
			<p>
				<label for="form_tags">Tags:</label>
				<input type="text" class="textinput" name="tags" id="form_tags" value="" /><br />
				<strong>Suggestions: </strong><?php echo str_replace(",",", ",trim($alltagsstring,",")); ?>
			</p>
			<p><input class="button" type="submit" value="Submit" name="new" /></p>
		</form>
	<?php } ?>
</div>
<div id="panel_edit" class="panel">
	<?php if ($_SESSION["page"] !== "loggedin") { ?>
		<h2>Log In</h2>
		<form action="/" method="post">
			<?php if (isset($message)) { echo "<p class='p_message'>".$message."</p>"; } ?>
			<input type="hidden" name="sessionid" value="<?php echo session_id(); ?>" />
			<p>
				<label for="username">Username:</label>
				<input type="text" name="username" id="username" value="<?php echo $_POST["username"]; ?>" class="textinput" />
			</p>
			<p>
				<label for="password">Password:</label>
				<input type="password" name="password" id="password" value="<?php echo $_POST["password"]; ?>" class="textinput" />
			</p>
			<p>
				<label></label>
				<input type="submit" value="Start-Wow!" class="button" />
			</p>
		</form>
	<?php } else { ?>
		<h2>Edit Thing</h2>
		<form method="post" action="">
			<input type="hidden" name="sessionid" value="<?php echo session_id(); ?>" />
			<input type="hidden" name="id" id="edit_id" value="" />
			<p>
				<label for="edit_title">Title:</label>
				<input type="text" class="textinput" name="title" id="edit_title" value="" />
			</p>
			<p>
				<label for="edit_description">Description:</label>
				<textarea class="textinput" name="description" id="edit_description"></textarea>
			</p>
			<p>
				<label for="edit_tags">Tags:</label>
				<input type="text" class="textinput" name="tags" id="edit_tags" value="" /><br />
				<strong>Suggestions: </strong><?php echo str_replace(",",", ",trim($alltagsstring,",")); ?>
			</p>
			<p><input class="button" type="submit" value="Submit" name="edit" /></p>
		</form>
	<?php } ?>
</div>
<div id="veil"></div>

<script src="http://www.google.com/jsapi" type="text/javascript"></script>
<script type="text/javascript">google.load("jquery", "1.4"); google.load("jqueryui", "1");</script>
<script src="javascript.js" type="text/javascript"></script>
<script type="text/javascript">
	$('#form_tags').tagSuggest({ tags: [<?php echo trim($alltagsstring,","); ?>] });
	if ($(".p_message").size() == 2) {
		$("#veil").show();
		$("#panel_new:has('.p_message')").show();
	}
</script>

</body>
</html>