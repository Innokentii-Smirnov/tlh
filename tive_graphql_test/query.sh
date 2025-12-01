curl --header "Content-Type: application/json" \
     --header "Accept: application/graphql-response+json" \
     --data-raw "$1" \
http://0.0.0.0:8066/graphql.php | jq .
