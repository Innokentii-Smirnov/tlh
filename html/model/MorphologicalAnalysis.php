<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';
require_once __DIR__ . '/Stem.php';
require_once __DIR__ . '/SuffixChain.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class MorphologicalAnalysis
{
  static ObjectType $graphQLType;

  public int $id;
  public int $stemId;
  public int $suffixChainId;

  function __construct(int $id, int $stemId, int $suffixChainId)
  {
    $this->id = $id;
    $this->stemId = $stemId;
    $this->suffixChainId = $suffixChainId;
  }

  private static function fromDbAssocRow(array $row): MorphologicalAnalysis
  {
    return new MorphologicalAnalysis($row['morphological_analysis_id'], $row['stem_id'], $row['suffix_chain_id']);
  }

  /** @return MorphologicalAnalysis[] */
  static function selectMorphologicalAnalysesByStemId(int $stemId): array
  {
    $sqlQuery = <<<'SQL'
    select * from tive_morphological_analyses as analysis
    where analysis.stem_id = ?;
SQL;
    return SqlHelpers::executeMultiSelectQuery(
      $sqlQuery,
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $stemId),
      fn(array $row): MorphologicalAnalysis => MorphologicalAnalysis::fromDbAssocRow($row)
    );
  }
}

MorphologicalAnalysis::$graphQLType = new ObjectType([
  'name' => 'MorphologicalAnalysis',
  'fields' => static fn(): array => [
    'id' => Type::nonNull(Type::int()),
    'stem' => [
      'type' => Type::nonNull(Stem::$graphQLType),
      'resolve' => fn(MorphologicalAnalysis $morph): Stem => Stem::selectStemById($morph->stemId)
    ],
    'suffixChain' => [
      'type' => Type::nonNull(SuffixChain::$graphQLType),
      'resolve' => fn(MorphologicalAnalysis $morph): SuffixChain => SuffixChain::selectSuffixChainById($morph->suffixChainId)
    ]
  ]
]);
