<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class MorphologicalAnalysis
{
  static ObjectType $graphQLType;

  public int $id;
  public string $suffixes;
  public string $morphTag;

  function __construct(int $id, string $suffixes, string $morphTag)
  {
    $this->id = $id;
    $this->suffixes = $suffixes;
    $this->morphTag = $morphTag;
  }

  private static function fromDbAssocRow(array $row): MorphologicalAnalysis
  {
    return new MorphologicalAnalysis($row['id'],  $row['suffixes'], $row['morph_tag']);
  }

  /** @return MorphologicalAnalysis[] */
  static function selectMorphologicalAnalysesByStemId(int $stemId): array
  {
    $sqlQuery = <<<'SQL'
    select
      analysis.morphological_analysis_id as id,
      suff.suffixes as suffixes,
      suff.morph_tag as morph_tag
    from tive_morphological_analyses as analysis
      inner join tive_suffix_chains as suff
        on analysis.suffix_chain_id = suff.suffix_chain_id
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
  'fields' => [
    'id' => Type::nonNull(Type::int()),
    'suffixes' => Type::nonNull(Type::string()),
    'morphTag' => Type::nonNull(Type::string())
  ]
]);
