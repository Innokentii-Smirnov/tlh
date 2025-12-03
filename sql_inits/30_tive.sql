use hpm;

drop table if exists
  tive_stems,
  tive_suffix_chains,
  tive_morphological_analyses,
  tive_wordforms,
  tive_morphosyntactic_words;

-- Hurrian stems

create table if not exists tive_stems (
  stem_id smallint unsigned auto_increment                                                        not null,
  form    varchar(63) character set utf8mb4 collate utf8mb4_bin                                   not null,
  pos     enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null,
  deu     varchar(127)                                                                            not null,
  eng     varchar(127)                                                                            not null,
  constraint pk_tive_stems primary key (stem_id),
  constraint unique_tive_stems unique (form, pos, deu)
);

create table if not exists tive_suffix_chains (
  suffix_chain_id smallint unsigned auto_increment                                                not null,
  suffixes        varchar(63) character set utf8mb4 collate utf8mb4_bin                           not null,
  morph_tag       varchar(127)                                                                    not null,
  pos     enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null,
  constraint pk_tive_suffix_chains primary key (suffix_chain_id),
  constraint unique_tive_suffix_chains unique (suffixes, morph_tag, pos)
);

create table if not exists tive_morphological_analyses (
  morphological_analysis_id smallint unsigned auto_increment not null,
  stem_id                   smallint unsigned                not null,
  suffix_chain_id           smallint unsigned                not null ,
  constraint pk_tive_morphological_analyses primary key (morphological_analysis_id),
  constraint fk_morph_stem_id foreign key (stem_id)
    references tive_stems (stem_id),
  constraint fk_morph_suffix_chain_id foreign key (suffix_chain_id)
    references tive_suffix_chains (suffix_chain_id),
  constraint unique_tive_morphological_analyses unique (stem_id, suffix_chain_id)
);

create table if not exists tive_wordforms (
  wordform_id   smallint unsigned auto_increment                                    not null,
  transcription varchar(127) character set utf8mb4 collate utf8mb4_bin              not null,
  constraint pk_tive_wordforms primary key (wordform_id),
  constraint unique_tive_wordforms unique (transcription)
);

-- A morphosyntactic word is a word-form with a particular
-- set of morphosyntactic properties (case, number, etc).

create table if not exists tive_morphosyntactic_words (
  morphosyntactic_word_id   smallint unsigned auto_increment  not null,
  wordform_id               smallint unsigned                 not null,
  morphological_analysis_id smallint unsigned                 not null,
  constraint pk_tive_morphosyntactis_words  primary key (morphosyntactic_word_id),
  constraint fk_morphosynt_word_wordform_id foreign key (wordform_id)
    references tive_wordforms (wordform_id),
  constraint fk_morphosynt_word_morph_id    foreign key (morphological_analysis_id)
    references tive_morphological_analyses (morphological_analysis_id),
  constraint unique_tive_morphosyntactic_words unique (wordform_id, morphological_analysis_id)
);
