#include <iostream>
#include <string>

#include <stdlib.h>

#include "json_spirit/json_spirit.h"
#include "re2/re2.h"

using namespace std;
using namespace json_spirit;

string getJSONFromArg(int argc, const char* argv[]) {
    if (argc != 2) {
        cout << "You must provide exactly one argument, which is your parsing JSON object."
             << endl;
        exit(0);
    }

    return string(argv[1]);
}

bool matchLine(Object& regexmap, string& line,
               Object& pubids, string& ts, string& v) {
    return false;
}

void applyParsers(string& jsonmap) {
    /*
     * Generate map of regexes
     * For each line of stdin:
     *      For each regex:
     *          If regex matches, publish timestamp,value pair and break
     */

    //string s;
    //RE2::FullMatch("ruby:1234", "(\\w+):(.*)", &s);

    //cout << s << endl;
    Value value;
    Object pubids;
    string line;
    string ts, v;

    read(jsonmap, value);
    Object regexmap = value.getObject();

    getline(cin, line);
    while(!cin.eof()) {
        matchLine(regexmap, line, pubids, ts, v);

        getline(cin, line);
    }
}

int main(int argc, const char *argv[]) {
    string jsonstr = getJSONFromArg(argc, argv);

    string s(argv[1]);
    cout << s << endl;

    //testjson = '{"map":[{"regex":"(.*),(.*)", "ts": 0, "pubid":1},{"regex":"(.*):(.*)","ts":1,"pubid":2}]}'
    // for test-datasource.txt provided by Jorge
    string testjson("{\"map\":[{\"regex\":\".* \\\\| ([0-9].*) \\\\| .* \\\\| (.*)\",\"ts\": 0, \"pubid\":1}]}");
    //testjson = r'{"map":[{"regex":".* \\| ([0-9].*) \\| .* \\| (.*)","ts": 0, "pubid":1}]}'
    jsonstr = testjson;

    applyParsers(jsonstr);

    return 0;
}
