package common

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type JWT struct {
	Secret string
}

var ERR_JWT_REQUIRED = CreateApplicationError(
	http.StatusBadRequest,
	"missing authentication token",
)
var ERR_JWT_INVALID = CreateApplicationError(
	http.StatusUnauthorized,
	"invalid authentication token",
)

func (j *JWT) GenerateJWT(duration time.Duration, userId string) (*string, error) {
	now := time.Now()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Subject:   userId,
		ExpiresAt: now.Add(duration).Unix(),
		IssuedAt:  now.Unix(),
		NotBefore: now.Unix(),
		Issuer:    "CRUD Application",
	})

	generatedToken, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return nil, err
	}

	return &generatedToken, nil
}

func (j JWT) tokenLookupFunction(auth string, c echo.Context) (interface{}, error) {
	keyFunc := func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != "HS256" {
			return nil, errors.New("invalid signing method")
		}
		return []byte(j.Secret), nil
	}

	token, err := jwt.Parse(auth, keyFunc)
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return token, nil
}

func (j JWT) Validate() echo.MiddlewareFunc {
	return middleware.JWTWithConfig(middleware.JWTConfig{
		Claims:         jwt.StandardClaims{},
		TokenLookup:    "header:" + echo.HeaderAuthorization,
		ParseTokenFunc: j.tokenLookupFunction,
		ErrorHandlerWithContext: func(err error, c echo.Context) error {
			if errors.Is(err, middleware.ErrJWTMissing) {
				return WriteFailResponse(c, ERR_JWT_REQUIRED, nil)
			}

			return WriteFailResponse(c, ERR_JWT_INVALID, nil)
		},
	})
}

func (j JWT) GetUserId(c echo.Context) string {
	if jwtContext, ok := c.Get("user").(*jwt.Token); ok {
		if jwtContext.Claims != nil {
			if claims, ok := jwtContext.Claims.(jwt.StandardClaims); ok {
				return claims.Subject
			}

			if claims, ok := jwtContext.Claims.(jwt.MapClaims); ok {
				return claims["sub"].(string)
			}
		}
	}

	return ""
}

func NewJWT(secret string) *JWT {
	return &JWT{
		Secret: secret,
	}
}
