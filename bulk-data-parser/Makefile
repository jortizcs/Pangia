all: build

build:
	g++ -o parse -I./re2/include -I./json-spirit/include -L./re2/lib -L./json-spirit/lib parse.cpp -lre2 -ljson_spirit -lpthread -lboost_thread

clean:
	rm parse
