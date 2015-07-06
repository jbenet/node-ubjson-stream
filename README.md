# ubjson cli tool

UBJSON streaming encoder

Use it as a library or install `ubjson` cli tool:
```
npm install -g ubjson-stream
```

## Usage

```
> ubjson -h
usage: ubjson -e <foo.json >foo.ubjson
       ubjson -d >foo.json <foo.ubjson

Options:
  -h, --help    this help text
  -e, --encode  encode json to ubjson
  -d, --decode  decode ubjson to json
  -p, --pretty  pretty json output
  -q, --quiet   no unnecessary output (newline)
  -n, --ndjson  newline delimited json
```

## Examples

### json coding

```
# encode json to ubjson
> echo '{"beep":"boop"}' | ubjson -e
osbeepsboop

# decode ubjson to json
> echo '{"beep":"boop"}' | ubjson -e | ubjson -d
{"beep":"boop"}
```

### pretty

```sh
# pretty print json
> echo '{"beep":"boop"}' | ubjson -e | ubjson -d -p
{
  "beep": "boop"
}
```

### ndjson

```sh
# encode ndjson to ubjsons (ubjson stream)
> echo '{"a":1}\n{"b":2}' | ubjson -en
osaBosbB

# decode ubjsons to ndjson
> echo '{"a":1}\n{"b":2}' | ubjson -en | ubjson -dn
{"a":1}
{"b":2}
```

### streaming

This tool supports streaming io, so you can pipe any unix tools over it.

First listen + decode ubjson to json:

```sh
nc -l 1234 | ubjson -dn
```

In another terminal, first define define a source of streaming json data. enter this to define tick function, which outputs a json date every second
```sh
tick() { while true; do ddd=$(date +"%Y-%m-%dT%H:%M:%SZ") && echo "{\"date\": \"$ddd\"}" && sleep 1; done }
```

Now, encode + send it over nc

```sh
tick | ubjson -en | nc localhost 1234
```

In the first (listening) terminal, you should now see json every second:

```sh
> nc -l 1234 | ubjson -dn
{"date":"2015-07-05T18:09:02Z"}
{"date":"2015-07-05T18:09:03Z"}
{"date":"2015-07-05T18:09:04Z"}
{"date":"2015-07-05T18:09:05Z"}
{"date":"2015-07-05T18:09:06Z"}
^C
```
