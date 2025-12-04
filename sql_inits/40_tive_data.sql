use hpm;

-- Hurrian stems

load data
  local
  infile '/hur_lex_data/stems.tsv'
  into table tive_stems
  (form, pos, deu, eng);

-- Hurrian suffix chains

load data
  local
  infile '/hur_lex_data/suffix_chains.tsv'
  into table tive_suffix_chains
  (suffixes, morph_tag, pos);

-- Hurrian morphological analyses

create temporary table tive_morphological_analyses_input (
  deu       varchar(127)                                                                      not null,
  morph_tag varchar(127)                                                                      not null,
  pos enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null
);

load data
  local
  infile '/hur_lex_data/morphological_analyses.tsv'
  into table tive_morphological_analyses_input
  (deu, morph_tag, pos);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
select
  (select stem_id from tive_stems where deu = input.deu),
  (select suffix_chain_id from tive_suffix_chains
   where morph_tag = input.morph_tag and pos = input.pos)
from tive_morphological_analyses_input input;

-- Hurrian word-forms

load data
  local
  infile '/hur_lex_data/transcriptions.tsv'
  into table tive_wordforms
  (transcription);

-- Hurrian morphosyntactic words

create temporary table tive_morphosyntactic_words_input (
  transcription varchar(127) character set utf8mb4 collate utf8mb4_bin                        not null,
  deu       varchar(127)                                                                      not null,
  morph_tag varchar(127)                                                                      not null,
  pos enum ('ADV', 'CONJ', 'PREP', 'POST', 'INTJ','NUM', 'PRON','NF','noun','verb','unclear') not null
);

load data
  local
  infile '/hur_lex_data/morphosyntactic_words.tsv'
  into table tive_morphosyntactic_words_input
  (transcription, deu, morph_tag, pos);

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select w.wordform_id, ma.morphological_analysis_id
from tive_morphological_analyses ma
  inner join tive_stems stem on ma.stem_id = stem.stem_id
  inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
  inner join tive_morphosyntactic_words_input input
    on stem.deu = input.deu and suff.morph_tag = input.morph_tag and suff.pos = input.pos
  inner join tive_wordforms w
    on w.transcription regexp input.transcription;
