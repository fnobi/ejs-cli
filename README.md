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
  -e, --exclude   file/directory names to exclude               [string] [space separated if more than one]
  -o, --out       file to write compiled.                       [string]
  -O, --options   option variables (file path or JSON string).  [string]
```

### examples

```bash
ejs-cli "*.ejs" --out dest/ --options options.json
# renders the *.ejs files in the current working directory and outputs compiled files to dest/
```

```bash
ejs-cli --base-dir src/ "*.ejs" --out dest/
# renders the *.ejs files in src/ and outputs compiled files to dest/
```

```bash
ejs-cli --base-dir src/ "**/*.ejs" --out dest/
# renders the *.ejs files in src/ and its subdirectories and outputs compiled files to dest/
```

Make sure to quote the file pattern, otherwise, your shell will expand it before it is passed to ejs-cli.
This behaviour would prevent ejs-cli from walking down the tree in this latest exemple.

```bash
ejs-cli --base-dir src/ "**/*.ejs" --exclude "partials/" --out dest/
# exclude any "partials" directory from rendering
```

```bash
cat example.ejs | ejs-cli example.ejs > example.html
```
