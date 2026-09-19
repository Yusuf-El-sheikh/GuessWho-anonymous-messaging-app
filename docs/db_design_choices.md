# GuessWho

## DB choices

### Users

- name [required] [string] [minlength_3] [maxlength_50]
- email [required] [string] [lowercase] [unique] 
- password [optional] [string] [minlength_8] 
- provider [google - local]
- isVerified [boolean] [default:false]
- isDeleted [boolean] [default:false]
- createdAt [date]
- updatedAt [date]

### Messages

- sender [objectId>>user] [optional] [default:"GuessWho?"]
- reciever [objectId>>user] [required]
- content [string] [minlength_1] [maxlength_500]
- createdAt [date]
- updatedAt [date]
- isDeleted [boolean]

### OTP

- code [string] [required] [length_6]
- email [string] [required] [trim] [lowercase]
- createdAt [date]
- expiresAt [date]

# To do :

- implement default sender case in the service layer since its a null in the db layer instead of an objectId