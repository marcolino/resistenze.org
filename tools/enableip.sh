#!/usr/bin/env bash
#
# Enable current IP

PAGE_LOGIN="https://admin.aruba.it/PannelloAdmin/Login.aspx"
PAGE_DOMAIN_CHOOSE="https://admin.aruba.it/PannelloAdmin/LoginDomain.aspx?Lang=IT"
USERNAME='236291@aruba.it'
PASSWORD='******'

# login
# curl \
#   -s -o /dev/null \
#   -X GET \
#   -d "username=${USERNAME}&password=${PASSWORD}" \
#   -H "Content-Type: application/x-www-form-urlencoded" \
#   -c "cookies.txt" \
#   "${PAGE_LOGIN}"
curl \
  -s \
  -X GET \
  --form login="$USERNAME" \
  --form password="$PASSWORD" \
  --cookie-jar cookies.txt \
  "${PAGE_LOGIN}"
exit

# choose domain
curl \
  -s \
  -X GET \
  -b "cookies.txt" \
  "${PAGE_DOMAIN_CHOOSE}"

