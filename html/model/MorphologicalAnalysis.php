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

  public string $segmentation;
  public string $gloss;

  function __construct(string $segmentation, string $gloss)
  {
    $this->segmentation = $segmentation;
    $this->gloss = $gloss;
  }

  private static function fromDbAssocRow(array $row): MorphologicalAnalysis
  {
    return new MorphologicalAnalysis($row['segmentation'], $row['gloss']);
  }

  /** @return MorphologicalAnalysis[] */
  static function selectMorphologicalAnalysesByStemId(int $stemId): array
  {
    $sqlQuery = <<<'SQL'
    select concat(stem.form, '-', suff.suffixes) segmentation,
           concat(stem.deu, '-', suff.morph_tag) gloss
    from tive_morphological_analyses as analysis
      inner join tive_stems as stem
        on analysis.stem_id = stem.stem_id
      inner join tive_suffix_chains as suff
        on analysis.suffix_chain_id = suff.suffix_chain_id;
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
    'segmentation' => Type::nonNull(Type::string()),
    'gloss' => Type::nonNull(Type::string())
  ]
]);
