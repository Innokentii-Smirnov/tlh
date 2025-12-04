rm -r mutation_output
mkdir mutation_output
for file in mutations/*; do
  data=$(jq -R --slurp '{query: .}' $file)
  ./query.sh "$data" > "mutation_output/$(basename $file .graphql).json"
done
