LESSSRC= \
	public/lib/css/custom/custom.less
LESSCSS=$(LESSSRC:.less=.css)
LESSCMD=node_modules/less/bin/lessc

NPMINSTALL=npm install

RUNSERVER=node app.js

PYTHONDEP=python pythonDep.py

DEBDEPS= \
	libmysqlclient-dev \
	python-numpy \
	python-scipy \
	python-mysqldb

.PHONY: all
all: install css

.PHONY: install
install: config.json
	$(NPMINSTALL)

config.json:
	cp config.json.default config.json

.PHONY: css
css: $(LESSCSS)

%.css: $(LESSSRC)
	$(LESSCMD) $(@:.css=.less) $@

.PHONY: python
python: 
	$(PYTHONDEP)

.PHONY: debian-deps
debian-deps:
	sudo apt-get install $(DEBDEPS)

.PHONY: server
server: install css python
	$(RUNSERVER)
