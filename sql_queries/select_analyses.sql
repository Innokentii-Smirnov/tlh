select
  analysis.morphological_analysis_id as ident,
  case
    when suff.suffixes = '' or suff.suffixes like '=%'
      then concat(stem.form, suff.suffixes)
    else concat(stem.form, '-', suff.suffixes)
  end segmentation,
  case
    when suff.morph_tag = '' or suff.morph_tag like '=%' or suff.morph_tag like '.%'
      then concat(stem.deu, suff.morph_tag)
    else concat(stem.deu, '-', suff.morph_tag)
  end gloss
from tive_morphological_analyses as analysis
  inner join tive_stems as stem on analysis.stem_id = stem.stem_id
  inner join tive_suffix_chains as suff on analysis.suffix_chain_id = suff.suffix_chain_id
order by ident;
