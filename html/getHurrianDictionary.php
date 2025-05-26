<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/json');
$dbFileName = 'hurrianLexicalDatabase.sqlite';
if (file_exists($dbFileName))
{
  $db = new SQLite3($dbFileName);
  $sql = "SELECT * FROM 'wordforms'";
  $result = $db->query($sql);
  $data = array();
  while ($row = $result->fetchArray())
  {
    $data[$row['form']][] = $row['analysis'];
  }
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
}
else
{
  echo '{}';
}
?>