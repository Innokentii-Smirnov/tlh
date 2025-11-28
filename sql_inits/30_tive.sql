use hpm;

drop table if exists
  tive_stems,
  tive_suffix_chains,
  tive_morphological_analyses;

-- Hurrian stems

create table if not exists tive_stems (
  stem_id smallint unsigned auto_increment                                                        not null,
  form    varchar(63)                                                                             not null,
  pos     enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null,
  deu     varchar(127)                                                                            not null,
  eng     varchar(127)                                                                            not null,
  constraint pk_tive_stems primary key (stem_id)
);

create table if not exists tive_suffix_chains (
  suffix_chain_id smallint unsigned auto_increment                                                not null,
  suffixes        varchar(63)                                                                     not null,
  morph_tag       varchar(127)                                                                    not null,
  pos     enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null,
  constraint pk_tive_suffix_chains primary key (suffix_chain_id)
);

create table if not exists tive_morphological_analyses (
  morphological_analysis_id smallint unsigned auto_increment not null,
  stem_id                   smallint unsigned                not null,
  suffix_chain_id           smallint unsigned                not null ,
  constraint pk_tive_morphological_analyses primary key (morphological_analysis_id),
  constraint fk_morph_stem_id foreign key (stem_id)
    references tive_stems (stem_id),
  constraint fk_morph_suffix_chain_id foreign key (suffix_chain_id)
    references tive_suffix_chains (suffix_chain_id)
);
