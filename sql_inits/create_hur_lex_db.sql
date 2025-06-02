create database if not exists hurrian_lexical_database;
use hurrian_lexical_database;

/* begin table creation */

CREATE TABLE if not exists lemma (
  lemma_id mediumint unsigned not null auto_increment,
  stem text not null,
  part_of_speech text not null,
  translation_de text not null,
  determinative text,
  constraint pk_lemma primary key (lemma_id)
);

CREATE TABLE if not exists suffix_chain (
  suffix_chain_id mediumint unsigned not null auto_increment,
  suffixes text not null,
  morph_tag text not null,
  part_of_speech text not null,
  constraint pk_suffix_chain primary key (suffix_chain_id)
);

CREATE TABLE if not exists wordform (
  wordform_id mediumint unsigned not null auto_increment,
  transcription text not null,
  segmentation text not null,
  lemma_id mediumint unsigned not null,
  suffix_chain_id mediumint unsigned not null,
  constraint fk_lemma_id foreign key (lemma_id)
    references lemma (lemma_id),
  constraint fk_suffix_chain_id foreign key (suffix_chain_id)
    references suffix_chain (suffix_chain_id),
  constraint pk_wordform primary key (wordform_id)
);

/* end table creation */