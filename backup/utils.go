package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	pg "github.com/habx/pg-commands"
)

func WriteString(w http.ResponseWriter, s string) {
	io.WriteString(w, fmt.Sprintln(s))
	fmt.Println(s)
}

func NewFilename(basicFilename string) string {
	dt := time.Now()
	return fmt.Sprintf("%s_%s.sql", basicFilename, dt.Format("2006-01-02_15-04-05"))
}

func NewPostgres(host, port, db, user, password string) *pg.Postgres {
	porttoi, err := strconv.Atoi(os.Getenv(port))
	if err != nil {
		panic(err)
	}

	return &pg.Postgres{
		Host:     os.Getenv(host),
		Port:     porttoi,
		DB:       os.Getenv(db),
		Username: os.Getenv(user),
		Password: os.Getenv(password),
	}
}
