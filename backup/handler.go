package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	pg "github.com/habx/pg-commands"
)

type Handler struct{}

func (h *Handler) getenv(db *pg.Postgres) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		getenv(w, db)
	}
}

func (h *Handler) dump(dump *pg.Dump, filename string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		filename := NewFilename(filename)
		dump.SetFileName(filename)
		WriteString(w, "Dumping database to "+filename+"...")
		res := ExecDump(w, dump)
		if res.Error != nil {
			WriteString(w, "Dump failed")
			return
		}
	}
}

func (h *Handler) backup(path string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		files, err := ioutil.ReadDir(path)
		if err != nil {
			WriteString(w, "Error while reading directory: "+err.Error())
			return
		}

		if len(files) == 0 {
			WriteString(w, "No backup found")
			return
		}

		linklist := make(MultiLinkList, len(files))
		for i, f := range files {
			linklist[i] = MultiLink{HrefMain: "/download?filename=" + f.Name(), TextMain: f.Name(), HrefSub: "/restore?filename=" + f.Name(), TextSub: "Restore"}
		}
		WrapperHtml(w, r, linklist.ToHtml)
	}
}

func (h *Handler) list(path string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		files, err := ioutil.ReadDir(path)
		if err != nil {
			WriteString(w, "Error while reading directory: "+err.Error())
			return
		}

		if len(files) == 0 {
			WriteString(w, "No backup found")
			return
		}

		// list all files as json
		list := make(List, len(files))
		for i, f := range files {
			list[i] = f.Name()
		}
		list.ToJson(w, r)
	}
}

func (h *Handler) restore(restore *pg.Restore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			WriteString(w, "No filename given")
			return
		}
		fmt.Println("Restoring database...")
		ExecRestore(w, filename, restore)
	}
}

func (h *Handler) download(path string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			WriteString(w, "No filename given")
			return
		}
		http.ServeFile(w, r, path+filename)
	}
}
