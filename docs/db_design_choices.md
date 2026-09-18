# GuessWho

## DB choices

### Users

- name [required] [string] [minlength_3] [maxlength_50]
- email [required] [string] [lowercase] [unique] 
- password [optional] [string] [minlength_8] 
- provider [google - facebook - local]
- isVerified [boolean] [default:false]
- isDeleted [boolean] [default:false]
- createdAt [date]
- lastUpdatedAt [date]

### Messages

- sender [objectId>>user] [optional] [default:"GuessWho?"] [maxlength_50]
- reciever [objectId>>user] [required] [maxlength_50]
- content [string] [minlength_1] [maxlength_500]
- sentAt [date]
- lastUpdatedAt [date]
- isDeleted [boolean]
