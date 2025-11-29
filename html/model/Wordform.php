<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class Wordform
{
  static ObjectType $graphQLType;

  public string $transcription;

  function __construct(string $transcription)
  {
    $this->transcription = $transcription;
  }

  private static function fromDbAssocRow(array $row): Wordform
  {
    return new Wordform($row['transcription']);
  }

  /** @return Wordform[] */
  static function selectTranscriptionsByMorphologicalAnalysisId(
    int $morphologicalAnalysisId): array
  {
    $sqlQuery = <<<'SQL'
    select wordform.transcription as transcription
    from tive_morphosyntactic_words as word
      inner join tive_wordforms as wordform
        on word.wordform_id = wordform.wordform_id
      inner join tive_morphological_analyses as ma
      on word.morphological_analysis_id = ma.morphological_analysis_id
    where ma.morphological_analysis_id = ?
SQL;
    return SqlHelpers::executeMultiSelectQuery(
      $sqlQuery,
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $morphologicalAnalysisId),
      fn(array $row): Wordform => Wordform::fromDbAssocRow($row)
    );
  }
}

Wordform::$graphQLType = new ObjectType([
  'name' => 'Wordform',
  'fields' => [
    'transcription' => Type::nonNull(Type::string())
  ]
]);
