rm -r "output/$1"
mkdir -p "output/$1"
for file in input/"$1"/*.graphql; do
  data=$(jq -R --slurp '{query: .}' $file)
  ./query.sh "$data" > "output/$1/$(basename $file .graphql).json"
done
./check.sh "$1"
