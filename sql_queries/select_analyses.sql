select concat(stem.form, '-', suff.suffixes) segmentation,
       concat(stem.deu, '-', suff.morph_tag) gloss
from tive_morphological_analyses as analysis
  inner join tive_stems as stem on analysis.stem_id = stem.stem_id
  inner join tive_suffix_chains as suff on analysis.suffix_chain_id = suff.suffix_chain_id;
