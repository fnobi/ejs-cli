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
ejs-cli "*.ejs" --out dest/ --options options.json 
```


```bash
ejs-cli --base-dir src/ "*.ejs" --out dest/
# renders all of the files in src/ and outputs them to dest/
```

```
cat example.ejs | ejs-cli example.ejs > example.html
```
