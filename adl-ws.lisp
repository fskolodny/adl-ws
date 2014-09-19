;;;; adl-ws.lisp

(in-package #:adl-ws)

;;; "adl-ws" goes here. Hacks and glory await!

(define-easy-handler (facilities :uri "/facilities") (user)
  (log-message* :info "~a ~a ~a" (request-uri*) (get-parameters*) user)
  (setf (content-type*) "application/json")
  (encode-json-to-string (query (format nil "OGEN.GET_FAC_LIST @USERID='~:@(~a~)'"
                                        user)
                                :format :alists)
   )
  )

(defvar acceptor)
(setf acceptor (make-instance 'easy-acceptor :port 8000
                              :document-root #p"./public"))

(defun start-server (&optional (acceptor acceptor))
  (start acceptor)
  (connect-toplevel "ADLPRO2" "OGEN" "OGEN1" "192.168.1.184")
  )
(defun stop-server (&optional (acceptor acceptor))
  (disconnect-toplevel)
  (stop acceptor)
  )
