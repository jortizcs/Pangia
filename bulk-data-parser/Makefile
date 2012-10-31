all: build

build:
	g++ -o parse -I./re2/include -I./json-spirit/include -L./re2/lib -L./json-spirit/lib parse.cpp re2/lib/libre2.a json-spirit/lib/libjson_spirit.a -lpthread -lboost_thread

clean:
	rm parse
