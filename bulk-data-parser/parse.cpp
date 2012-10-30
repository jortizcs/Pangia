#include <iostream>
#include <string>

#include <stdlib.h>

#include "re2/re2.h"

using namespace std;

string getJSONFromArg(int argc, const char* argv[]) {
    if (argc != 2) {
        cout << "You must provide exactly one argument, which is your parsing JSON object."
             << endl;
        exit(0);
    }

    return string(argv[1]);
}


int main(int argc, const char *argv[]) {
    string jsonstr = getJSONFromArg(argc, argv);

    string s(argv[1]);
    cout << s << endl;

    //string s;
    //RE2::FullMatch("ruby:1234", "(\\w+):(.*)", &s);

    //cout << s << endl;

    return 0;
}
