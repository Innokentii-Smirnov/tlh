<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';
require_once __DIR__ . '/ManuscriptIdentifier.php';
require_once __DIR__ . '/ManuscriptLanguage.php';
require_once __DIR__ . '/AbstractManuscript.php';


use GraphQL\Type\Definition\{InputObjectType, Type};
use mysqli;
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class StemInput
{
  static InputObjectType $graphQLInputObjectType;
  
  public string $form;
  public string $pos;
  public string $deu;
  
  function __construct(string $form, string $pos, string $deu)
  {
    $this->form = $form;
    $this->pos = $pos;
    $this->deu = $deu;
  }
  
  static function fromGraphQLInput(array $input): StemInput
  {
    return new StemInput($input['form'], $input['pos'], $input['deu']);
  }
  
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert into tive_stems (form, pos, deu, eng) values (?, ?, ?, '');",
      fn(mysqli_stmt $stmt) => $stmt->bind_param('sss', $this->form, $this->pos, $this->deu)
    );
  }
}
