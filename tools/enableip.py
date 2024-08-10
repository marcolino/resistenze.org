#!/usr/bin/env python
#
# Enable current IP
 
import requests
from bs4 import BeautifulSoup

login_page = 'https://admin.aruba.it/PannelloAdmin/Login.aspx'
username = '236291@aruba.it'
password = '******'

# step 1: fetch the login page
session = requests.Session()
response = session.get(login_page)
soup = BeautifulSoup(response.text, 'html.parser')

# step 2: extract hidden fields
hidden_fields = {}
hidden_tags = soup.find_all("input", type = "hidden")
for tag in hidden_tags:
  name = tag.get('name', '')
  value = tag.get('value', '')
  hidden_fields[name] = value
print('hidden fields:', hidden_fields)

# step 3: prepare login data including hidden fields
login_data = {
  'login': username,
  'password': password,
  **hidden_fields
}
print ("----------------------")
print('login_data:', login_data)

# step 4: submit the login form
login_url = login_page
login_response = session.post(login_url, data = login_data)

# check if login was successful
print(login_response.text)
