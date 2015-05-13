Frequently Used Commands
---

These commands are assuming you are currently in the `src` folder.

Exporting Flatpages
===

```
./manage.py dumpdata sites flatpages --indent=4 > ./src/fixtures/pages.json
```

Compile Bootstrap
===

```
grunt
```

Running Development Server
===

```
./manage.py syncdb
./manage.py runserver
```
