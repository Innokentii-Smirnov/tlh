select
  wordform.transcription,
  stem.form,
  suff.suffixes,
  suff.morph_tag
from tive_morphosyntactic_words word
  inner join tive_wordforms as wordform
    on word.wordform_id = wordform.wordform_id
  inner join tive_morphological_analyses as analysis
    on word.morphological_analysis_id = analysis.morphological_analysis_id
  inner join tive_stems as stem on analysis.stem_id = stem.stem_id
  inner join tive_suffix_chains as suff on analysis.suffix_chain_id = suff.suffix_chain_id;
