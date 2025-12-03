rm -r mutation_output
mkdir mutation_output
for file in mutations/*; do
  data=$(tr -d '[:space:]' < $file | jq -R '{query: .}')
  ./query.sh "$data" > "mutation_output/$(basename $file .graphql).json"
done
