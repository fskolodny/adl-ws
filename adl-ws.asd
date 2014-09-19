;;;; adl-ws.asd

(asdf:defsystem #:adl-ws
  :serial t
  :description "Describe adl-ws here"
  :author "Fila Kolodny <fskolodny@gmail.com>"
  :license "Specify license here"
  :depends-on (#:cl-ppcre
               #:hunchentoot
               #:cl-json
               #:mssql)
  :components ((:file "package")
               (:file "adl-ws")))

