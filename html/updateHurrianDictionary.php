<?php
header('Access-Control-Allow-Origin: *');
$dbFileName = 'hurrianLexicalDatabase.sqlite';
$dbExists = file_exists($dbFileName);
$word = $_POST['word'];
$analysis = $_POST['analysis'];
$db = new SQLite3($dbFileName);
if (!$dbExists)
{
  $sql = "CREATE TABLE 'wordforms' ('wordformid' INTEGER PRIMARY KEY, 'form' TEXT, 'analysis' TEXT)";
  $db->exec($sql);
}
$sql = "INSERT INTO 'wordforms' ('form', 'analysis') VALUES ('$word', '$analysis')";
$db->exec($sql);
?>