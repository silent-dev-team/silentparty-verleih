package main

import (
	"fmt"
	"net/http"

	pg "github.com/habx/pg-commands"
)

const (
	Port          = 8080
	Path          = "/backups/"
	basicFilename = "dump"
)

func main() {
	db := NewPostgres("DB_HOST", "DB_PORT", "DB_DATABASE", "DB_USER", "DB_PASSWORD")
	dump := NewDump(db, Path, "")
	restore := NewRestore(db, Path)

	h := Handler{}

	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/getenv", h.getenv(db))
	http.HandleFunc("/dump", h.dump(dump, basicFilename))
	http.HandleFunc("/backups/", h.backup(Path))
	http.HandleFunc("/list", h.list(Path))
	http.HandleFunc("/restore", h.restore(restore))
	http.HandleFunc("/download", h.download(Path))

	fmt.Printf("Listening on port %d\n", Port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", Port), nil)
	if err != nil {
		panic(err)
	}
}

func getenv(w http.ResponseWriter, postgres *pg.Postgres) {
	fmt.Fprintf(w, "%s@%s:%d/%s",
		postgres.Username,
		postgres.Host,
		postgres.Port,
		postgres.DB,
	)
}
