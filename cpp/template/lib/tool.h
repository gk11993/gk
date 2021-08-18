#include <windows.h>
#include <iostream>
#include <vector>
// #include <TlHelp32.h>
// #include <thread>
#include <sys/time.h>
using namespace std;
class Tool
{
public:
    Tool();
    ~Tool();
    vector<string> split(string&, string);
    float random(int, int);
    char randStr();
    long long indexOf(const string &, string, bool);
    template<class T> char color(int, T);
    void strArrSub(string &, string);
    int findKey(vector<string>&,  string);
};
Tool::Tool()
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    srand(tv.tv_usec);
}

Tool::~Tool()
{

}
vector<string> Tool::split(string &str, string pattern)
{
    vector<string> result;
    str += pattern;
    int size = str.size();
    for (int i = 0; i < size; i++)
    {
        int pos = str.find(pattern, i);
        if (pos < size)
        {
            string s = str.substr(i, pos - i);
            if ( s.length() ) result.push_back(s);
            i = pos + pattern.size() - 1;
        }
    }
    return result;
}
float Tool::random(int min=0, int max=1)
{
    return (float) rand() / RAND_MAX * (max-min)+min;
}
char Tool::randStr()
{
    return random(97, 123);
}
void Tool::strArrSub(string &path, string pattern)
{
    vector<string> dir = split(path, pattern);
    path.replace(indexOf(path, dir[dir.size()-1], TRUE), path.size(), "");
}
long long Tool::indexOf(const string &str, string pattern, bool r=FALSE)
{
    long long result = -1;
    if ( pattern.size() > str.size() ) return result;
    if ( r )
    {
        for (int i = str.size()-1; i >= pattern.size()-1 ; --i)
        {
            string curr = str.substr(i, pattern.size());
            if ( curr == pattern )
            {
                result = i;
                break;
            }
        }    
    } else {
        for (int i = 0; i < str.size()-pattern.size()+1; ++i)
        {
            string curr = str.substr(i, pattern.size());
            if ( curr == pattern )
            {
                result = i;
                break;
            }
        }
    }
    return  result;
}

template<class T> char Tool::color(int n, T t)
{
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), n);
    t();
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 7);
    return {0};
}
int Tool::findKey(vector<string>& vec,  string key)
{
    for (int i = 0; i < vec.size(); ++i)
    {
        if ( vec[i] == key ) return i;
    }
    return -1;
}
//启动线程
// thread t(fun);
// t.join();
// t.detach();

//文本转整数 cahr类型atoi
// char n[20];
// strcpy(n, "123");
// cout << atoi(n)+1 << endl;

//数字转文本
// char str[255] = {0};
// itoa(15, str, 10);
// cout << str1  << endl;
