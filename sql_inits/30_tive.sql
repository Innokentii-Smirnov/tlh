use hpm;

drop table if exists
  tive_stems;

-- Hurrian stems

create table if not exists tive_stems (
  stem_id smallint unsigned auto_increment                                            not null primary key,
  form    varchar(63)                                                                             not null,
  pos     enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null,
  deu     varchar(127)                                                                            not null,
  eng     varchar(127)                                                                            not null
);
