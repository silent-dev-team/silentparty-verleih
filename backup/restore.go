package main

import (
	"fmt"
	"net/http"

	pg "github.com/habx/pg-commands"
)

func NewRestore(postgres *pg.Postgres, path string) *pg.Restore {
	restore, err := pg.NewRestore(postgres)
	if err != nil {
		panic("Error while creating restore: " + err.Error())
	}
	restore.SetPath(path)
	return restore
}

func ExecRestore(w http.ResponseWriter, file string, r *pg.Restore) *pg.Result {
	restoreExec := r.Exec(file, pg.ExecOptions{StreamPrint: false})
	if restoreExec.Error != nil {
		fmt.Println(restoreExec.Error.Err)
		fmt.Println(restoreExec.Output)
		WriteString(w, "Restore failed")
	} else {
		fmt.Println(restoreExec.Output)
		WriteString(w, "Restore success")
	}
	return &restoreExec
}
