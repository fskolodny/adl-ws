;;;; adl-ws.lisp

(in-package #:adl-ws)

;;; "adl-ws" goes here. Hacks and glory await!

(define-easy-handler (facilities :uri "/facilities") (user)
  (setf (content-type*) "application/json")
  (encode-json-to-string
   (with-connection ("ADLPRO2" "OGEN" "OGEN1" "192.168.1.184")
     (query (format nil "OGEN.GET_FAC_LIST @USERID='~:@(~a~)'" user)
            :format :alists)
     )
   )
  )

(define-easy-handler (units :uri "/units") (facility)
  (setf (content-type*) "application/json")
  (encode-json-to-string
   (with-connection ("ADLPRO2" "OGEN" "OGEN1" "192.168.1.184")
     (query (format nil "SELECT * FROM ~a WHERE ~a='~a'"
                    "OGEN.PAT_C_NURSING_UNIT" "FACILITY_KEY" facility)
            :format :alists)
     )
   )
  )

(define-easy-handler (patients :uri "/patients") (facility unit)
  (setf (content-type*) "application/json")
  (encode-json-to-string
   (with-connection ("ADLPRO2" "OGEN" "OGEN1" "192.168.1.184")
     (query (format nil "SELECT * FROM ~a WHERE ~a"
                    "OGEN.GEN_M_PATIENT_MAST"
                    (format nil "FACILITY_KEY='~a' AND UNIT_CODE='~a' AND ADMIT_DATE>'1900-01-02' AND ADMIT_DATE<=GETDATE()"
                            facility unit)
                    )
            :format :alists)
     )
   )
  )

(define-easy-handler (login :uri "/login") ()
  (setf (content-type*) "application/json")
  (let* ((post-data (decode-json-from-string (raw-post-data :force-text t)))
         (user (cdr (assoc :user post-data)))
         (password (cdr (assoc :password post-data)))
         )
    (encode-json-plist-to-string
     (list :is-logged-on
           (with-connection ("ADLPRO2" "OGEN" "OGEN1" "192.168.1.184")
             (query (format nil
                            "OGEN.CAN_LOGIN @P_USER_ID='~a',@P_PASSWORD='~a'"
                            user password)
                    :format :single)
             )
           )
     )
    )
  )
(defvar acceptor)
(setf acceptor (make-instance 'easy-acceptor :port 8000
                              :document-root (ensure-directory-pathname
                                              (merge-pathnames* (getcwd)
                                                                "public"))))

(defun start-server (&optional (acceptor acceptor))
  (start acceptor)
  )
(defun stop-server (&optional (acceptor acceptor))
  (stop acceptor)
  )
