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

void freeREVector(vector<re2::RE2*>& regexv) {
    for (vector<re2::RE2*>::iterator it = regexv.begin(); it != regexv.end(); it++) {
        delete (*it);
    }
}

void getMapFromRawJSON(string& rawjson, vector<re2::RE2*>& regexv,
                       vector<int>& tsv, vector<int>& pubidv) {
    Value value;
    read(rawjson, value);
    Array m = value.getObject()["map"].getArray();

    for (vector<Value>::iterator it = m.begin(); it != m.end(); it++) {
        Object o = (*it).getObject();
        string regex = o["regex"].getString();
        regexv.push_back(new RE2(regex));
        tsv.push_back(o["ts"].getInt());
        pubidv.push_back(o["pubid"].getInt());
    }
}

bool matchLine(string& line,
               vector<re2::RE2*>& regexv, vector<int>& tsv, vector<int>& pubidv,
               int& pubid, string& ts, string& v) {
    //cout << "matching line!" << endl;
    for (int i = 0; i < regexv.size(); i++) {
    }
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

    vector<re2::RE2*> regexv;
    vector<int> tsv, pubidv;
    getMapFromRawJSON(jsonmap, regexv, tsv, pubidv);

    int pubid;
    string ts;
    string value;
    string line;

    getline(cin, line);
    while(!cin.eof()) {
        matchLine(line, regexv, tsv, pubidv, pubid, ts, value);

        getline(cin, line);
    }

    freeREVector(regexv);
}

int main(int argc, const char *argv[]) {
    string jsonstr = getJSONFromArg(argc, argv);

    string s(argv[1]);

    //testjson = '{"map":[{"regex":"(.*),(.*)", "ts": 0, "pubid":1},{"regex":"(.*):(.*)","ts":1,"pubid":2}]}'
    // for test-datasource.txt provided by Jorge
    string testjson("{\"map\":[{\"regex\":\".* \\\\| ([0-9].*) \\\\| .* \\\\| (.*)\",\"ts\": 0, \"pubid\":1}]}");
    //testjson = r'{"map":[{"regex":".* \\| ([0-9].*) \\| .* \\| (.*)","ts": 0, "pubid":1}]}'
    jsonstr = testjson;

    applyParsers(jsonstr);

    return 0;
}
