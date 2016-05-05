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
  -O, --options   option variables (file path or JSON string).  [string]
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
cat example.ejs | ejs-cli example.ejs > example.html
```
