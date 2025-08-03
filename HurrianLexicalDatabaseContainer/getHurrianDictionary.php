<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/json');
$dbFileName = 'hurrianLexicalDatabase.sqlite';
if (file_exists($dbFileName))
{
  $db = new SQLite3($dbFileName);
  $sql = <<<SQL
  SELECT w.transcription, w.segmentation, l.translation_de, s.morph_tag, l.part_of_speech, l.det
  FROM wordforms w
    INNER JOIN lemmata l ON l.lemma_id = w.lemma_id
    INNER JOIN suffix_chains s ON s.suffix_chain_id = w.suffix_chain_id;
  SQL;
  $result = $db->query($sql);
  $data = array();
  while ($row = $result->fetchArray())
  {
    $fields = array($row['segmentation'],
                    $row['translation_de'],
                    $row['morph_tag'],
                    $row['part_of_speech'],
                    $row['det']);
    $data[$row['transcription']][] = implode(' @ ', $fields);
  }
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
}
else
{
  echo '{}';
}
?>