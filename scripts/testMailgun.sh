#!/bin/bash

source .env

curl -s --user "api:$MAILGUN_API_KEY" \
    https://api.mailgun.net/v3/$MAILGUN_DOMAIN/messages \
    -F from="Excited User <mailgun@$MAILGUN_DOMAIN>" \
    -F to=alex.aralis@gmail.com \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomness!'