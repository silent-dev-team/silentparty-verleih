package main

import (
	"io"
	"net/http"
)

type Html interface {
	ToHtml(w http.ResponseWriter, r *http.Request)
}

type Json interface {
	ToJson(w http.ResponseWriter, r *http.Request)
}

// List is a list of strings
type List []string

func (l List) ToHtml(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "<ul>")
	for _, s := range l {
		io.WriteString(w, "<li>"+s+"</li>")
	}
	io.WriteString(w, "</ul>")
}

func (l List) ToJson(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "[")
	for i, s := range l {
		if i > 0 {
			io.WriteString(w, ",")
		}
		io.WriteString(w, "\""+s+"\"")
	}
	io.WriteString(w, "]")
}

// LinkList is a list of links
type LinkList []Link

type Link struct {
	Href string
	Text string
}

func (ll LinkList) ToHtml(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "<ul>")
	for _, l := range ll {
		io.WriteString(w, "<li><a href=\""+l.Href+"\">"+l.Text+"</a></li>")
	}
	io.WriteString(w, "</ul>")
}

func (ll LinkList) ToJson(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "[")
	for i, l := range ll {
		if i > 0 {
			io.WriteString(w, ",")
		}
		io.WriteString(w, "{\"href\":\""+l.Href+"\",\"text\":\""+l.Text+"\"}")
	}
	io.WriteString(w, "]")
}

// MultiLinkList is a list of links with a main and a sub link
type MultiLinkList []MultiLink

type MultiLink struct {
	HrefMain string
	TextMain string
	HrefSub  string
	TextSub  string
}

func (ll MultiLinkList) ToHtml(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "<ul>")
	for _, l := range ll {
		io.WriteString(w, "<li><a href=\""+l.HrefMain+"\">"+l.TextMain+"</a> - <a href=\""+l.HrefSub+"\">"+l.TextSub+"</a></li>")
	}
	io.WriteString(w, "</ul>")
}

func (ll MultiLinkList) ToJson(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "[")
	for i, l := range ll {
		if i > 0 {
			io.WriteString(w, ",")
		}
		io.WriteString(w, "{\"href_main\":\""+l.HrefMain+"\",\"text_main\":\""+l.TextMain+"\",\"href_sub\":\""+l.HrefSub+"\",\"text_sub\":\""+l.TextSub+"\"}")
	}
	io.WriteString(w, "]")
}

// WrapperHtml wraps a function that writes to a http.ResponseWriter
func WrapperHtml(w http.ResponseWriter, r *http.Request, f func(w http.ResponseWriter, r *http.Request)) {
	io.WriteString(w, "<html><body>")
	f(w, r)
	io.WriteString(w, "</body></html>")
}
