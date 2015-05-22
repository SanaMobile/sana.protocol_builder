Frequently Used Commands
===

These commands are assuming you are currently in the `src-backend` folder.

Exporting Flatpages
---

```
./manage.py dumpdata sites flatpages --indent=4 > ./fixtures/pages.json
```

Compile Bootstrap
---

```
grunt
```

Running Development Server
---

```
./manage.py syncdb
./manage.py runserver
```
