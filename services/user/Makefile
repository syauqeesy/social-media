test:
	go test ./... -v -coverpkg=./... -coverprofile=test-coverage.out
test-coverage:
	go test ./... -v -coverpkg=./... -coverprofile=test-coverage.out && go tool cover -html=test-coverage.out
