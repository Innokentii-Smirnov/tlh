rm -r output
mkdir output
for file in queries/*; do
  data=$(jq -R --slurp '{query: .}' $file)
  ./query.sh "$data" > "output/$(basename $file .graphql).json"
done
./check.sh
