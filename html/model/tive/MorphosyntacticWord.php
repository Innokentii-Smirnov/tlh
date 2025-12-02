<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/MorphologicalAnalysis.php';
require_once __DIR__ . '/Wordform.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class MorphosyntacticWord
{
  static ObjectType $graphQLType;

  public int $id;
  public int $morphologicalAnalysisId;
  public int $wordformId;

  function __construct(int $id, int $morphologicalAnalysisId, int $wordformId)
  {
    $this->id = $id;
    $this->morphologicalAnalysisId = $morphologicalAnalysisId;
    $this->wordformId = $wordformId;
  }

  private static function fromDbAssocRow(array $row): MorphosyntacticWord
  {
    return new MorphosyntacticWord($row['morphosyntactic_word_id'], $row['morphological_analysis_id'], $row['wordform_id']);
  }

  /** @return MorphologicalAnalysis[] */
  static function selectMorphosyntacticWordsByMorphologicalAnalysisId(int $morphologicalAnalysisId): array
  {
    $sqlQuery = <<<'SQL'
    select * from tive_morphosyntactic_words as word
    where word.morphological_analysis_id = ?;
SQL;
    return SqlHelpers::executeMultiSelectQuery(
      $sqlQuery,
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $morphologicalAnalysisId),
      fn(array $row): MorphosyntacticWord => MorphosyntacticWord::fromDbAssocRow($row)
    );
  }
}

MorphosyntacticWord::$graphQLType = new ObjectType([
  'name' => 'MorphosyntacticWord',
  'fields' => static fn(): array => [
    'id' => Type::nonNull(Type::int()),
    'morphologicalAnalysis' => [
      'type' => Type::nonNull(MorphologicalAnalysis::$graphQLType),
      'resolve' => fn(MorphosyntacticWord $word): MorphologicalAnalysis => MorphologicalAnalysis::selectMorphologicalAnalysisById($word->morphologicalAnalysisId)
    ],
    'wordform' => [
      'type' => Type::nonNull(Wordform::$graphQLType),
      'resolve' => fn(MorphosyntacticWord $word): Wordform => Wordform::selectWordformById($word->wordformId)
    ]
  ]
]);
