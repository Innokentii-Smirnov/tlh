mkdir -p output
for file in queries/*; do
  data=$(tr -d '[:space:]' < $file | jq -R '{query: .}')
  ./query.sh "$data" > "output/$(basename $file .graphql).json"
done
