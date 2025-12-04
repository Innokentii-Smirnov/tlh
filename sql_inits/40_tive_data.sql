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

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'nāli') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'Rehbock' and suff.morph_tag = '.ABS') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'melaḫḫum') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'vertreiben' and suff.morph_tag = 'TR.PFV-3A.SG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription regexp 'p[aā]banni$') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'Berg' and suff.morph_tag in ('.ABS', 'RElAT.SG-DIR/LOC')) morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'fūru') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'sehen' and suff.morph_tag = 'MED') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'šidarillōm') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'verfluchen' and suff.morph_tag = 'ITER-INGR-TR.PFV-3A.SG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'idilānni') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'schlagen' and suff.morph_tag = 'MOD.ACT-l-DESID') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'amelānni') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'verbrennen' and suff.morph_tag = 'MOD.ACT-l-DESID') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription regexp 'tārr[ei]ž') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'Feuer' and suff.morph_tag = 'RELAT.SG-ERG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription regexp 'p[aā]banniž') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'Berg' and suff.morph_tag = 'RELAT.SG-ERG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'kulōrum') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'sprechen' and suff.morph_tag = 'TR.PFV-3A.SG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription = 'amarillōm') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'ansehen' and suff.morph_tag = 'ITER-INGR-TR.PFV-3A.SG') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription regexp '[aā]ima') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'falls; wenn' and suff.morph_tag = '=CON') morphs;

insert into tive_morphosyntactic_words (wordform_id, morphological_analysis_id)
select wordform_id, morphological_analysis_id from
  (select wordform_id from tive_wordforms
    where transcription regexp '^[aā]i$') wordforms cross join
  (select morphological_analysis_id from tive_morphological_analyses ma
    inner join tive_stems stem on ma.stem_id = stem.stem_id
    inner join tive_suffix_chains suff on ma.suffix_chain_id = suff.suffix_chain_id
    where stem.deu = 'falls; wenn' and suff.morph_tag = '') morphs;
