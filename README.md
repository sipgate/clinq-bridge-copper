# CLINQ-Bridge for Copper

This service provides contacts from [Copper](https://www.copper.com/) for CLINQ.

## Development

```shell
yarn && yarn start
```

### getContacts

```shell
curl -H "X-Provider-Key: mail@example.com:XXXXXXXXXXXXXXXXXX" localhost:8080/contacts
```

### createContact

```shell
curl -H "content-type: application/json" -H "X-Provider-Key: mail@example.com:XXXXXXXXXXXXXXXXXX" --data @contact.json localhost:8080/contacts
```

### updateContact

```shell
curl -X PUT -H "content-type: application/json" -H "X-Provider-Key: mail@example.com:XXXXXXXXXXXXXXXXXX" --data @contact.json localhost:8080/contacts/1234567890
```

### deleteContact

```shell
curl -X DELETE -H "content-type: application/json" -H "X-Provider-Key: mail@example.com:XXXXXXXXXXXXXXXXXX" localhost:8080/contacts/1234567890
```

## License

[Apache 2.0](LICENSE)
