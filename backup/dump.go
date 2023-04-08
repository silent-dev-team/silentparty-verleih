package main

import (
	"fmt"
	"net/http"

	pg "github.com/habx/pg-commands"
)

func NewDump(postgres *pg.Postgres, path string, filename string) *pg.Dump {
	dump, err := pg.NewDump(postgres)
	if err != nil {
		panic("Error while creating dump: " + err.Error())
	}
	dump.SetPath(path)

	if filename != "" {
		dump.SetFileName(filename)
	}

	return dump
}

func ExecDump(w http.ResponseWriter, d *pg.Dump) *pg.Result {
	dumpExec := d.Exec(pg.ExecOptions{StreamPrint: false})
	if dumpExec.Error != nil {
		fmt.Println(dumpExec.Error.Err)
		fmt.Println(dumpExec.Output)
		WriteString(w, "Dump failed")
	} else {
		fmt.Println(dumpExec.Output)
		WriteString(w, "Dump success")
	}
	return &dumpExec
}
