use hpm;

-- Hurrian stems

insert into tive_stems (form, pos, deu, eng)
values ('nāli', 'noun', 'Rehbock', 'deer');

insert into tive_stems (form, pos, deu, eng)
values ('mel+aḫḫ', 'verb', 'vertreiben', 'drive away');

insert into tive_stems (form, pos, deu, eng)
values ('paba+ni', 'noun', 'Berg', 'mountain');

insert into tive_stems (form, pos, deu, eng)
values ('fūr', 'verb', 'sehen', 'see');

insert into tive_stems (form, pos, deu, eng)
values ('šid', 'verb', 'verfluchen', 'curse');

insert into tive_stems (form, pos, deu, eng)
values ('id', 'verb', 'schlagen', 'strike');

insert into tive_stems (form, pos, deu, eng)
values ('am', 'verb', 'verbrennen', 'burn');

insert into tive_stems (form, pos, deu, eng)
values ('tāri', 'noun', 'Feuer', 'fire');

insert into tive_stems (form, pos, deu, eng)
values ('kul', 'verb', 'sprechen', 'speak');

insert into tive_stems (form, pos, deu, eng)
values ('am', 'verb', 'ansehen', 'look at');

insert into tive_stems (form, pos, deu, eng)
values ('ai', 'CONJ', 'falls; wenn', 'in case; if');

-- Hurrian suffix chains

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('', '.ABS', 'noun');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('ne-ž', 'RELAT.SG-ERG', 'noun');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('o-m', 'TR.PFV-3A.SG', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('ne-e', 'RELAT.SG-DIR/LOC', 'noun');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('u', 'MED', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('ar-ill-ō-m', 'ITER-INGR-TR.PFV-3A.SG', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('i-l-ānni', 'MOD.ACT-l-DESID', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('ōr-o-m', 'ōr-TR.PFV-3A.SG', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('ār-a', 'ITER-3A.SG', 'verb');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('=ma', '=CON', 'CONJ');

insert into tive_suffix_chains (suffixes, morph_tag, pos)
values ('', '', 'CONJ');

-- Hurrian morphological analyses

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'Rehbock'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = '.ABS')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'Berg'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'RELAT.SG-ERG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'vertreiben'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'TR.PFV-3A.SG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'Berg'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'RElAT.SG-DIR/LOC')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'sehen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'MED')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'verfluchen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'ITER-INGR-TR.PFV-3A.SG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'Berg'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = '.ABS')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'verbrennen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'MOD.ACT-l-DESID')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'Feuer'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'RELAT.SG-ERG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'schlagen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'MOD.ACT-l-DESID')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'sprechen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'ōr-TR.PFV-3A.SG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'verfluchen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'ITER-3A.SG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'ansehen'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = 'ITER-INGR-TR.PFV-3A.SG')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'falls; wenn'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = '=CON')
);

insert into tive_morphological_analyses (stem_id, suffix_chain_id)
values (
  (select stem_id from tive_stems where deu = 'falls; wenn'),
  (select suffix_chain_id from tive_suffix_chains where morph_tag = '' and pos = 'CONJ')
);
