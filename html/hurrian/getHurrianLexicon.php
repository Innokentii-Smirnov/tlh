<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/json');
$dbFileName = 'hurrianLexicalDatabase.sqlite';
if (file_exists($dbFileName))
{
  $db = new SQLite3($dbFileName);
  $sql = <<<SQL
  SELECT stem, part_of_speech, translation_de
  FROM lemmata;
  SQL;
  $result = $db->query($sql);
  $data = array();
  while ($row = $result->fetchArray())
  {
    $key = $row['stem'].','.$row['part_of_speech'];
    $data[$key][] = $row['translation_de'];
  }
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
}
else
{
  echo '{}';
}
?>