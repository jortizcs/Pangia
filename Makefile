LESSSRC= \
	public/lib/css/custom/custom.less
LESSCSS=$(LESSSRC:.less=.css)
LESSCMD=node_modules/less/bin/lessc

NPMINSTALL=npm install

RUNSERVER=node app.js

.PHONY: all
all: install css

.PHONY: install
install:
	$(NPMINSTALL)

css: $(LESSCSS)

%.css: $(LESSSRC)
	$(LESSCMD) $(@:.css=.less) $@

.PHONY: server
server: install css
	$(RUNSERVER)
