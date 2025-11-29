select wordform.transcription as transcription
from tive_morphosyntactic_words as word
  inner join tive_wordforms as wordform
    on word.wordform_id = wordform.wordform_id
  inner join tive_morphological_analyses as ma
    on word.morphological_analysis_id = ma.morphological_analysis_id
  where ma.morphological_analysis_id = 7
