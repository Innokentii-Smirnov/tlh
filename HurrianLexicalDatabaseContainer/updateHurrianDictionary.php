<?php
header('Access-Control-Allow-Origin: *');
include('commonHurrian.php');
$dbFileName = 'hurrianLexicalDatabase.sqlite';
$dbExists = file_exists($dbFileName);
$word = $_POST['word'];
$analysis = $_POST['analysis'];
list($segmentation, $translation, $tag, $template, $det) = explode(' @ ', $analysis);
$pos = getPos($template);
list($stem, $suffixes) = parseSegmentation($segmentation);

//Datenbank öffnen oder erstellen
$db = new SQLite3($dbFileName);
if (!$dbExists)
{
  $sql = <<<SQL
  CREATE TABLE 'lemmata' (
    'lemma_id' INTEGER PRIMARY KEY,
    'stem' TEXT,
    'part_of_speech' TEXT,
    'translation_de' TEXT,
    'det' TEXT
  );
  CREATE TABLE 'suffix_chains' (
    'suffix_chain_id' INTEGER PRIMARY KEY,
    'suffixes' TEXT,
    'morph_tag' TEXT,
    'part_of_speech' TEXT
  );
  CREATE TABLE 'wordforms' (
    'wordform_id' INTEGER PRIMARY KEY,
    'transcription' TEXT,
    'segmentation' TEXT,
    'lemma_id' INTEGER,
    'suffix_chain_id' INTEGER
  );
  SQL;
  $db->exec($sql);
}

//Lemma finden oder hinzufügen
$findLemma = <<<SQL
SELECT lemma_id
FROM 'lemmata'
WHERE stem = '$stem'
AND part_of_speech = '$pos'
AND translation_de = '$translation'
AND det = '$det';
SQL;
$result = $db->query($findLemma);
$row = $result->fetchArray();
if (!$row) {
  $sql = <<<SQL
  INSERT INTO 'lemmata' ('stem', 'part_of_speech', 'translation_de', 'det')
  VALUES ('$stem', '$pos', '$translation', '$det');
  SQL;
  $db->exec($sql);
  $result = $db->query($findLemma);
  $row = $result->fetchArray();
}
$lemma_id = $row['lemma_id'];

//Suffixkette finden oder hinzufügen
$findSuffixChain = <<<SQL
SELECT suffix_chain_id
FROM 'suffix_chains'
WHERE suffixes = '$suffixes'
AND morph_tag = '$tag'
AND part_of_speech = '$pos';
SQL;
$result = $db->query($findSuffixChain);
$row = $result->fetchArray();
if (!$row) {
  $sql = <<<SQL
  INSERT INTO 'suffix_chains' ('suffixes', 'morph_tag', 'part_of_speech')
  VALUES ('$suffixes', '$tag', '$pos');
  SQL;
  $db->exec($sql);
  $result = $db->query($findSuffixChain);
  $row = $result->fetchArray();
}
$suffix_chain_id = $row['suffix_chain_id'];

//Wortform finden oder hinzufügen
$findWordform = <<<SQL
SELECT wordform_id
FROM 'wordforms'
WHERE transcription = '$word'
AND segmentation = '$segmentation'
AND lemma_id = '$lemma_id'
AND suffix_chain_id = '$suffix_chain_id';
SQL;
$result = $db->query($findWordform);
$row = $result->fetchArray();
  if (!$row) {
  $sql = <<<SQL
  INSERT INTO 'wordforms' ('transcription', 'segmentation', 'lemma_id', 'suffix_chain_id')
  VALUES ('$word', '$segmentation', '$lemma_id', '$suffix_chain_id')
  SQL;
  $db->exec($sql);
}
?>