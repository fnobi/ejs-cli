ejs-cli
=======

ejs compile client.

## install

### from npm

```
npm -g install ejs-cli
```

### from github

```
git clone git://github.com/fnobi/ejs-cli.git
```

## usage

```
Options:
  -h, --help      show this help.                               [boolean]  [default: false]
  -f, --file      give ejs template file path.                  [string]
  -b, --base-dir  base directory that -f is relative to.        [string]  [default: "./"]
  -o, --out       file to write compiled.                       [string]
  -O, --options   option variables (file path or JSON string).  [string] (actually the 'data' parameter of EJS library)
  -C, --config    config variables (file path or JSON string).  [string] (actually the 'options' parameter of EJS library)
```

### examples

```bash
ejs-cli "*.ejs" --out dest/ --options options.json
# renders all of the files in the current working directory and outputs them to dest/
```

```bash
ejs-cli --base-dir src/ "*.ejs" --out dest/
# renders all of the files in src/ and outputs them to dest/
```

```bash
ejs-cli "myfile.ejs" --config "{\"delimiter\":\"$\"}" --options options.json
# renders the "myfile.ejs" file with inline config (set the custom delimiter "$") and an options.json data file
```

```bash
ejs-cli "myfile.ejs" --config config.json --options "{\"test\":\"123\"}"
# renders the "myfile.ejs" file with config.json config file and inline data
```

```bash
cat example.ejs | ejs-cli example.ejs > example.html
```
