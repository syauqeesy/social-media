package common

import (
	"reflect"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/stretchr/testify/mock"
)

func Diff(t *testing.T, expected, actual interface{}, ignoredFields ...string) bool {
	actualType := reflect.TypeOf(actual)

	var actualNewType reflect.Value

	if actualType.Kind() == reflect.Slice {
		if actualType.Elem().Kind() == reflect.Ptr {
			actualNewType = reflect.New(actualType.Elem().Elem())
		}
	} else {
		actualNewType = reflect.New(actualType.Elem())
	}

	diff := cmp.Diff(
		expected,
		actual,
		cmpopts.IgnoreUnexported(actualNewType.Elem().Interface()),
		cmpopts.IgnoreFields(actualNewType.Elem().Interface(), ignoredFields...),
	)

	if diff != "" {
		t.Errorf("Save() mismatch (-want +got):\n%s", diff)
	}

	return diff == ""
}

func MatchedBy(t *testing.T, expected interface{}, ignoredFields ...string) interface{} {
	return mock.MatchedBy(func(actual interface{}) bool {
		return Diff(t, expected, actual, ignoredFields...)
	})
}
